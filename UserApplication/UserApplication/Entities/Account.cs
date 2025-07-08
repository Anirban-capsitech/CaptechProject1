using MongoDB.Bson.Serialization.Attributes;

namespace UserApplication.Entities
{
    public class Account
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        string? Id { get; set; }
        public string Name { get; set; }
        public string MobNo { get; set; }
        public string Email { get; set; }
        public DateTime DoB { get; set; }
        public  string? UserId { get; set; }
        public string? RefreshToken { get; set; }
        public  string Password { get; set; }
    }
}
