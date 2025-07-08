using MongoDB.Bson.Serialization.Attributes;

namespace UserApplication.Entities
{
    public class DoctorData
    {
        public string? Id { get; set; }
        public string DoctorName { get; set; }
        [BsonElement("Department")]
        public string Dept { get; set; }
        public string BillNo { get; set; }
    }
}
