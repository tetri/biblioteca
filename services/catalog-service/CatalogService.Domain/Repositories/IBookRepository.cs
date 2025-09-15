using CatalogService.Domain.Entities;

namespace CatalogService.Domain.Repositories;

public interface IBookRepository
{
    Task<Book?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Book>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Book>> SearchAsync(string query, CancellationToken cancellationToken = default);

    Task AddAsync(Book book, CancellationToken cancellationToken = default);
    Task UpdateAsync(Book book, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);

    Task<bool> DecrementCopiesAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> IncrementCopiesAsync(Guid id, CancellationToken cancellationToken = default);
}
