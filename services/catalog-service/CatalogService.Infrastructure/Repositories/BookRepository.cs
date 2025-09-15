using CatalogService.Domain.Entities;
using CatalogService.Domain.Repositories;

using MongoDB.Driver;

namespace CatalogService.Infrastructure.Repositories;

public class BookRepository : IBookRepository
{
    private readonly MongoContext _context;

    public BookRepository(MongoContext context)
    {
        _context = context;
    }

    public async Task<Book?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Books.Find(b => b.Id == id).FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IEnumerable<Book>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Books.Find(_ => true).ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Book>> SearchAsync(string query, CancellationToken cancellationToken = default)
    {
        var filter = Builders<Book>.Filter.Or(
            Builders<Book>.Filter.Regex(b => b.Title, query),
            Builders<Book>.Filter.Regex(b => b.Author, query),
            Builders<Book>.Filter.Regex(b => b.Category, query),
            Builders<Book>.Filter.Regex(b => b.Isbn, query)
        );

        return await _context.Books.Find(filter).ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Book book, CancellationToken cancellationToken = default)
    {
        await _context.Books.InsertOneAsync(book, cancellationToken: cancellationToken);
    }

    public async Task UpdateAsync(Book book, CancellationToken cancellationToken = default)
    {
        await _context.Books.ReplaceOneAsync(b => b.Id == book.Id, book, cancellationToken: cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var result = await _context.Books.DeleteOneAsync(b => b.Id == id, cancellationToken);
        return result.DeletedCount > 0;
    }

    public async Task<bool> DecrementCopiesAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var update = Builders<Book>.Update.Inc(b => b.AvailableCopies, -1);
        var result = await _context.Books.UpdateOneAsync(
            b => b.Id == id && b.AvailableCopies > 0,
            update,
            cancellationToken: cancellationToken
        );
        return result.ModifiedCount > 0;
    }

    public async Task<bool> IncrementCopiesAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var update = Builders<Book>.Update.Inc(b => b.AvailableCopies, 1);
        var result = await _context.Books.UpdateOneAsync(b => b.Id == id, update, cancellationToken: cancellationToken);
        return result.ModifiedCount > 0;
    }
}
