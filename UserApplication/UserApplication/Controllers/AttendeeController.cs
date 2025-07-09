using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Threading.Tasks;
using UserApplication.Data;
using UserApplication.Entities;

namespace UserApplication.Controllers
{
    [ApiController]
    public class AttendeeController(AppDbContext context) : Controller
    {
        [HttpPost("addattendee")]
        [Authorize]
        public async Task<IActionResult> AddAttendee([FromBody] Attendee AttendeeData)
        {
            if (string.IsNullOrWhiteSpace(AttendeeData.AttendeeName))
            {
                return BadRequest("Attendee name cannot be empty.");
            }
            var filter = Builders<Attendee>.Filter.Where(x => x.BillNo == AttendeeData.BillNo);
            var result = await context.Attendee.Find(filter).FirstOrDefaultAsync();

            if(result == null)
            {
                try
                {
                    await context.Attendee.InsertOneAsync(new Attendee
                    {
                        AttendeeName = AttendeeData.AttendeeName,
                        BillNo = AttendeeData.BillNo,
                        Dept = AttendeeData.Dept,
                        _sts = 1
                    });
                    return Ok(AttendeeData);
                }
                catch (Exception ex)
                {
                    return BadRequest("An error occurred while adding the attendee.");
                }
            }
            else
            {
                var update = Builders<Attendee>.Update
                    .Set(x => x.AttendeeName, AttendeeData.AttendeeName)
                    .Set(x => x.Dept, AttendeeData.Dept)
                    .Set(x => x._sts, 1);

                try
                {
                    var updatedData = await context.Attendee.UpdateOneAsync(filter , update);
                    return Ok(updatedData);
                }
                catch (Exception ex)
                {
                    return BadRequest("An error occurred while adding the attendee." + ex);
                }
                
            }
           
        }

        [HttpGet("getattendeelist")]
        [Authorize]
        public async Task<IActionResult> GetAllAttendee()
        {
            var filter = Builders<Attendee>.Filter.Where(u => u._sts != 0);
            var projection = Builders<Attendee>.Projection.Expression(u => new AttendeeResponse
            {
                Id = u.Id!,
                AttendeeName = u.AttendeeName,
                BillNo = u.BillNo,
                Dept = u.Dept,
            });

            var allAttendeeData = await context.Attendee.Find(filter).Project(projection).ToListAsync();
            int count = 1;
            foreach(var data in allAttendeeData)
            {
                data.slNo = count++;
            }
            return Ok(allAttendeeData);
        }

        [HttpPost("deleteattendeelist")]
        [Authorize]
        public async Task<IActionResult> DeleteAllAttendee([FromBody]string _id)
        {
            var filter = Builders<Attendee>.Filter.Where(u => u.Id == _id && u._sts != 0);
            var update = Builders<Attendee>.Update.Set(u => u._sts, 0);

            var result = await context.Attendee.UpdateOneAsync(filter, update);

            if (result.MatchedCount == 0)
                return BadRequest("No matching data found for deletion.");
            return Ok("Data Deleted");
        }
    }


}
