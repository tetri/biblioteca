using LoanService.Domain.Entities;
using MongoDB.Driver;

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

    public async Task ConfigureIndexesAsync()
    {
        var indexKeysDefinition = Builders<Loan>.IndexKeys
            .Ascending(l => l.UserId)
            .Ascending(l => l.BookId);

        var indexOptions = new CreateIndexOptions<Loan>
        {
            Unique = true,
            PartialFilterExpression = Builders<Loan>.Filter.In(l => l.Status, new[] { LoanStatus.Reserved, LoanStatus.Active })
        };

        var indexModel = new CreateIndexModel<Loan>(indexKeysDefinition, indexOptions);
        await Loans.Indexes.CreateOneAsync(indexModel);
    }
}
