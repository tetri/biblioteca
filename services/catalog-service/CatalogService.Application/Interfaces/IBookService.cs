using CatalogService.Application.DTOs;

namespace CatalogService.Application.Interfaces;

public interface IBookService
{
    Task<BookResponseDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<BookResponseDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<BookResponseDto>> SearchAsync(string query, CancellationToken cancellationToken = default);

    Task<BookResponseDto> CreateAsync(CreateBookDto dto, CancellationToken cancellationToken = default);
    Task<BookResponseDto?> UpdateAsync(Guid id, UpdateBookDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);

    Task<bool> DecrementCopiesAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> IncrementCopiesAsync(Guid id, CancellationToken cancellationToken = default);

    Task<int?> GetAvailabilityAsync(Guid id, CancellationToken cancellationToken = default);
}
