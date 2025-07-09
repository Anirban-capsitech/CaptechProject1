using MongoDB.Driver;
using UserApplication.Entities;


namespace UserApplication.Data
{
    public class AppDbContext
    {
        private readonly IMongoDatabase _database;

        public AppDbContext(IConfiguration configuration)
        {
            var connectionSting = configuration.GetConnectionString("MongoDB");
            var databaseName = configuration.GetConnectionString("DatabaseName");

            var client = new MongoClient(connectionSting);
            _database = client.GetDatabase(databaseName);
        }

        public IMongoCollection<User> User => _database.GetCollection<User>("UserList");

        public IMongoCollection<Account> Account => _database.GetCollection<Account>("AccountList");

        public IMongoCollection<Attendee> Attendee => _database.GetCollection<Attendee>("AttendeeList");


    }
}
