using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UserApplication.Entities
{
    public class Attendee
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string AttendeeName { get; set; }
        [BsonElement("Department")]
        public string Dept { get; set; }
        public string BillNo { get; set; }
        public int? _sts {get ; set;}
    }

    public class AttendeeResponse : Attendee
    {
        public int? slNo { get; set; }
    }
}
