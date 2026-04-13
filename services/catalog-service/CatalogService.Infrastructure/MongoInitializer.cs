using MongoDB.Driver;
using CatalogService.Domain.Entities;
using CatalogService.Infrastructure;

namespace CatalogService.Infrastructure;

public static class MongoInitializer
{
    public static async Task InitializeAsync(MongoContext context)
    {
        // Garante índice único para ISBN no catálogo
        var indexKeys = Builders<Book>.IndexKeys.Ascending(b => b.Isbn);
        var indexOptions = new CreateIndexOptions { Unique = true };
        await context.Books.Indexes.CreateOneAsync(new CreateIndexModel<Book>(indexKeys, indexOptions));
    }
}
