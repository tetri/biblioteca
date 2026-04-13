using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using LoanService.Domain.Entities;

namespace LoanService.Infrastructure;

public class MongoContext
{
    private readonly IMongoDatabase _database;

    public MongoContext(string connectionString, string databaseName)
    {
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(databaseName);
    }

    public IMongoCollection<Loan> Loans => _database.GetCollection<Loan>("loans");
}
