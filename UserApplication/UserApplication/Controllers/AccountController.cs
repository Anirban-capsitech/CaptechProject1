using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserApplication.Data;
using UserApplication.Entities; 
namespace UserApplication.Controllers
{
    [ApiController]
    public class AccountController(AppDbContext context, IConfiguration configuration) : Controller
    {
        private IConfiguration _configuration = configuration;

        //Takes user input and fetch data from backend
        [HttpPost("signup")]
        public async Task<IActionResult> SignUp(Account account)
        {
            string userId = account.Name.ToLower().Substring(0, 4);
            int year = account.DoB.Year;

            account.UserId = userId + "_" + year;
            account.RefreshToken = null;
            account.Password = BCrypt.Net.BCrypt.EnhancedHashPassword(account.Password);
            Console.WriteLine();

            await context.Account.InsertOneAsync(account);
            return Ok(account);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(string UserId, string Password)
        {
            if (string.IsNullOrEmpty(UserId) || string.IsNullOrEmpty(Password))
            {
                return BadRequest("Invalid login credentials");
            }

            var accounts = await context.Account.Find(Builders<Account>.Filter.Where(a => a.UserId == UserId)).ToListAsync();

            var existingAccount = accounts.FirstOrDefault(a => BCrypt.Net.BCrypt.EnhancedVerify(Password, a.Password));

            if (existingAccount == null)
            {
                return Unauthorized("Invalid userId or password.");
            }

            return Ok(new LoginResponse
            {
                AccessToken = GetAccessToken(existingAccount),
                RefreshToken = await GetRefreshTokenAsync(existingAccount)
            });
        }

        [HttpPost("RefreshToken")]
        public async Task<ActionResult> RefreshToken([FromQuery] string accessToken, [FromQuery] string refreshToken)
        {
            var refreshAccountFilter = Builders<Account>.Filter.Where(x => x.RefreshToken == refreshToken);
            var refreshTokens = context.Account.Find(refreshAccountFilter).FirstOrDefault();
            if (refreshTokens is not null)
            {
                var filter = Builders<Account>.Filter.Where(x => x.UserId == refreshTokens.UserId);
                var userDetails = context.Account.Find(filter).FirstOrDefault();
                if (userDetails is not null)
                {
                    return Ok(new LoginResponse
                    {
                        AccessToken = GetAccessToken(userDetails),
                    });
                }
                else
                {
                    return BadRequest("User id or password is invalid");
                }
            }
            else
            {
                return BadRequest("Refresh Token is not valid");
            }
        }


        private async Task<string> GetRefreshTokenAsync(Account user)
        {
            var randomBytes = new byte[32];
            using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
                string refreshToken = Convert.ToBase64String(randomBytes);
                var filter = Builders<Account>.Filter.Where(a => a.UserId == user.UserId && a.Password == user.Password);
                try
                {
                    var entities = await context.Account.Find(filter).FirstOrDefaultAsync();
                    UpdateDefinition<Account> update;

                    update = Builders<Account>.Update.Set(u => u.RefreshToken, refreshToken);

                    var result = await context.Account.UpdateOneAsync(filter, update);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
                return refreshToken;
            }
        }

        private string GetAccessToken(Account userDetails)
        {
            var jwtSecurity = new JwtSecurityTokenHandler();
            var securityToken = jwtSecurity.CreateToken(new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                        new Claim(ClaimTypes.Name, userDetails.UserId.ToString()),
                        new Claim(ClaimTypes.Email, userDetails.Password.ToString()),
                    }),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])), SecurityAlgorithms.HmacSha256),
            });
            string accessToken = jwtSecurity.WriteToken(securityToken);
            return accessToken;
        }


    }
}



