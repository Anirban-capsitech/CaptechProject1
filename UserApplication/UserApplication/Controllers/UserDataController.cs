using Capsitech;
using Capsitech.PDF;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Text;
using UserApplication.Data;
using UserApplication.Entities;

namespace UserApplication.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserDataController : ControllerBase
    {
        public readonly AppDbContext context;

        public UserDataController(AppDbContext _context)
        {
            this.context = _context;
        }

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
        public async Task<ActionResult> GetList(string? search, int? pageSize, int? page , string sortDir = "asc" , bool sort = false)
        {
            int count = 1;

            try
            {
                var filter = Builders<User>.Filter.Where(u => u._sts != 0);

                if (!string.IsNullOrWhiteSpace(search))
                {
                    var searchFilter = Builders<User>.Filter.Where(u =>
                        u.PersonalDetails.Name.Contains(search) ||
                        (u.BillNo!).Contains(search) ||
                        u.PersonalDetails.PhNo.ToString().StartsWith(search)
                    );
                    filter = Builders<User>.Filter.And(filter, searchFilter);
                }

                // base query
                var qry = context.User.Aggregate()
                    .Match(filter)
                    .Lookup<User, Attendee, UserlookupModel>(
                        context.Attendee,
                        u => u.BillNo,
                        a => a.BillNo,
                        u => u.AttendeeDetails
                    )
                    .Project(u => new UserResponse
                    {
                        Id = u.Id!,
                        Name = u.PersonalDetails.Name,
                        Email = u.PersonalDetails.Email,
                        PhoneNo = u.PersonalDetails.PhNo,
                        BillNo = u.BillNo,
                        AttendeeName = u.AttendeeDetails.FirstOrDefault() != null
                            ? u.AttendeeDetails.First().AttendeeName
                            : ""
                    });

                // apply paging only if values are provided
                if (page.HasValue && page.Value > 0 && pageSize.HasValue )
                {
                    int skip = (page.Value - 1) * pageSize.Value;
                    qry = qry.Skip(skip).Limit(pageSize.Value);
                }

                if (sort)
                {
                    if (sortDir.ToLower() == "asc")
                        qry = qry.SortBy(u => u.Name);
                    else if (sortDir.ToLower() == "desc")
                        qry = qry.SortByDescending(u => u.Name);
                    else
                        qry = qry.SortByDescending(u => u.Name);
                }

                var userResponses = await qry.ToListAsync();

                foreach (var data in userResponses)
                {
                    data.slNo = count++;
                }

                return Ok(userResponses);
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred while fetching the data: " + ex.Message);
            }
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


        //[HttpGet("download-pdf")]
        [HttpGet("download-invoice/")]
        public async Task<IActionResult> DownloadInvoice([FromQuery]string billNo)
        {
            // Fetch user data from MongoDB (simplified)
            var filter = Builders<User>.Filter.Where( u => u.BillNo == billNo);
            var user = await context.User.Find(filter).FirstOrDefaultAsync();

            if (user == null)
                return NotFound("User not found.");

            var html = new StringBuilder();
            html.Append("<html><head><style>");
            html.Append("table { width: 100%; border-collapse: collapse; }");
            html.Append("th, td { border: 1px solid #ccc; padding: 8px; }");
            html.Append("h2 { text-align: center; }");
            html.Append("</style></head><body>");

            html.Append($"<h2>Invoice - {user.BillNo}</h2>");
            html.Append("<h4>Customer Details</h4>");
            html.Append($"<p><b>Name:</b> {user.PersonalDetails.Name}<br>");
            html.Append($"<b>Email:</b> {user.PersonalDetails.Email}<br>");
            html.Append($"<b>Phone:</b> {user.PersonalDetails.PhNo}</p>");

            html.Append("<h4>Address</h4>");
            html.Append($"<p>{user.Address.Street}, {user.Address.City}, {user.Address.State}, {user.Address.Country}</p>");

            html.Append("<h4>Items</h4>");
            html.Append("<table><thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>GST</th><th>Amount</th></tr></thead><tbody>");
            foreach (var item in user.ItemDetails)
            {
                html.Append($"<tr><td>{item.ItemDesc}</td><td>{item.Quantity}</td><td>{item.Price}</td><td>{item.Gst}%</td><td>{item.Amount}</td></tr>");
            }
            html.Append("</tbody></table>");

            html.Append("<h4>Payment</h4>");
            html.Append($"<p><b>Paid:</b> {user.Payment.PaidAmount}<br>");
            html.Append($"<b>Status:</b><span style=\"background-color: lightblue; padding: 3px 5px; boder-radious : 5px \"> {user.Payment.Status}</span>\r\n<br>");
            html.Append($"<b>Description:</b> {user.Payment.Desc}</p>");

            html.Append("</body></html>");

            // Convert HTML to PDF
            var pdfBytes = await Capsitech.PDF.PdfUtility.ConvertPdfWithoutHF(
                $"https://{Request.Host}/",
                html.ToString(),
                "Invoice");

            return File(pdfBytes, "application/pdf", $"Invoice_{user.BillNo}.pdf");
        }
    }
}