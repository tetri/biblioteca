using Microsoft.Extensions.Options;

using MongoDB.Driver;

using CatalogService.Domain.Entities;

namespace CatalogService.Infrastructure;

public class MongoContext
{
    private readonly IMongoDatabase _database;

    public MongoContext(IOptions<MongoSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        _database = client.GetDatabase(settings.Value.DatabaseName);
    }

    public IMongoCollection<Book> Books => _database.GetCollection<Book>("books");
}
