using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace UserApplication.Entities
{
    public class PersonalDetails
    {
        public string Name { get; set; }
        public string Email { get; set; }
        [BsonElement("Phone No.")]
        public long PhNo { get; set; }
    }

    public class Address
    {
        public string? Building { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
    }

    public class ItemDetail
    {
        [BsonElement("Item Description")]
        public string ItemDesc { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public int Gst { get; set; }
        public decimal Amount { get; set; }
    }

    public class Payment
    {
        [BsonElement("Paid Amount")]
        public decimal PaidAmount { get; set; }
        public string Status { get; set; }
        public string? Desc { get; set; }
    }

    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public PersonalDetails PersonalDetails { get; set; }
        public Address Address { get; set; }
        public ItemDetail[] ItemDetails { get; set; }
        public Payment Payment { get; set; }
        public string? BillNo { get; set; }
        public int? _sts { get; set; }
    }
}


