using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using UserApplication.Data;
using UserApplication.Entities;

namespace UserApplication.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserDataController(AppDbContext context) : Controller
    {

        [HttpGet("bill_list")]
        [Authorize]
        public async Task<ActionResult> GetBillList()
        {
            var filter = Builders<User>.Filter.Where(u => u._sts != 0);
            var projection = Builders<User>.Projection.Expression(u => new
            {
                Id = u.Id!,
                BillNo = u.BillNo,
            });

            var allBills = await context.User
                .Find(filter)
                .Project(projection)
                .ToListAsync();

            return Ok(allBills);
        }

        //Return all the available data from the database which are not deleted(_sts != 0)
        [HttpGet("list")]
        [Authorize]
        public async Task<ActionResult> GetList(string? search)
        {
            var filter = Builders<User>.Filter.Where(u => u._sts != 0);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchFilter = Builders<User>.Filter.Where(u => u.PersonalDetails.Name.Contains(search) || (u.BillNo!).Contains(search) || (u.PersonalDetails.PhNo).ToString().StartsWith(search));
                filter = Builders<User>.Filter.And(filter, searchFilter);
            }

            int count = 1;
            var projection = Builders<User>.Projection.Expression(u => new UserResponse
            {
                Id = u.Id!,
                Name = u.PersonalDetails.Name,
                Email = u.PersonalDetails.Email,
                PhoneNo = u.PersonalDetails.PhNo,
                BillNo = u.BillNo,
            });

            var userResponses = await context.User
                .Find(filter)
                .Project(projection)
                .ToListAsync();

            foreach (var data in userResponses)
            {
                data.slNo = count++;
            }
                
            return Ok(userResponses);
        }

        //Return a single user data by ID
        [HttpGet("single/{id}")]
        [Authorize]
        public async Task<IActionResult> GetSingle(string id)
        {
            var filter = Builders<User>.Filter.Where(u => u.Id == id && u._sts != 0);
            var entities = await context.User.Find(filter).FirstOrDefaultAsync();
            if (entities == null)
            {
                return NotFound("No data found with the given ID.");
            }
            return Ok(entities);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Update(User data)
        {
            foreach (var item in data.ItemDetails)
            {
                decimal total = item.Price * item.Quantity;
                item.Amount = total + total * (item.Gst / 100);
            }

            // Insert mode (Id is null)
            if (data.Id == "" || data.Id == null)
            {
                //Console.WriteLine("Data Adding");
                var all = await context.User.Find(Builders<User>.Filter.Empty).ToListAsync();
                int billNo = all.Count + 1;
                User newUser = new User
                {
                    PersonalDetails = data.PersonalDetails,
                    Address = data.Address,
                    ItemDetails = data.ItemDetails,
                    Payment = data.Payment,
                    _sts = 1,
                    BillNo = billNo.ToString("0000"),
                };

                await context.User.InsertOneAsync(newUser);
                return CreatedAtAction(nameof(Update), newUser);
            }

            // Update mode (Id exists)
            var filter = Builders<User>.Filter.Eq(u => u.Id, data.Id);

            UpdateDefinition<User> update;

            if (data._sts.HasValue && data._sts == 0)
            {
                update = Builders<User>.Update.Set(u => u._sts, 0);
            }
            else
            {
                update = Builders<User>.Update
                    .Set(u => u.ItemDetails, data.ItemDetails)
                    .Set(u => u.Address, data.Address)
                    .Set(u => u.PersonalDetails, data.PersonalDetails)
                    .Set(u => u.Payment, data.Payment)
                    .Set(u => u._sts, 1);
            }

            var result = await context.User.UpdateOneAsync(filter, update);

            if (result.MatchedCount == 0)
                return BadRequest("No matching user found for update.");

            return Ok("Database Updated");
        }

        [HttpPost("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteData(string id)
        {
            var filter = Builders<User>.Filter.Where(u => u.Id == id && u._sts != 0 );
            var update = Builders<User>.Update.Set(u => u._sts, 0);

            var result = await context.User.UpdateOneAsync(filter, update);

            if (result.MatchedCount == 0)
                return BadRequest("No matching data found for deletion.");
            return Ok("Data Deleted");
        }
    }
}