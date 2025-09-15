using CatalogService.Application.DTOs;
using CatalogService.Application.Interfaces;
using CatalogService.Domain.Entities;
using CatalogService.Domain.Repositories;

namespace CatalogService.Application.Services;

public class BookService : IBookService
{
    private readonly IBookRepository _repo;

    public BookService(IBookRepository repo)
    {
        _repo = repo;
    }

    public async Task<BookResponseDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var book = await _repo.GetByIdAsync(id, cancellationToken);
        return book is null ? null : ToResponseDto(book);
    }

    public async Task<IEnumerable<BookResponseDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var books = await _repo.GetAllAsync(cancellationToken);
        return books.Select(ToResponseDto);
    }

    public async Task<IEnumerable<BookResponseDto>> SearchAsync(string query, CancellationToken cancellationToken = default)
    {
        var books = await _repo.SearchAsync(query, cancellationToken);
        return books.Select(ToResponseDto);
    }

    public async Task<BookResponseDto> CreateAsync(CreateBookDto dto, CancellationToken cancellationToken = default)
    {
        var book = new Book(
            title: dto.Title,
            author: dto.Author,
            isbn: dto.Isbn,
            category: dto.Category,
            availableCopies: dto.AvailableCopies,
            totalCopies: dto.TotalCopies
        );

        await _repo.AddAsync(book, cancellationToken);
        return ToResponseDto(book);
    }

    public async Task<BookResponseDto?> UpdateAsync(Guid id, UpdateBookDto dto, CancellationToken cancellationToken = default)
    {
        var existing = await _repo.GetByIdAsync(id, cancellationToken);
        if (existing is null) return null;

        existing.Update(
            dto.Title,
            dto.Author,
            dto.Isbn,
            dto.Category,
            dto.TotalCopies,
            dto.AvailableCopies
        );

        await _repo.UpdateAsync(existing, cancellationToken);
        return ToResponseDto(existing);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _repo.DeleteAsync(id, cancellationToken);
    }

    public async Task<bool> DecrementCopiesAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _repo.DecrementCopiesAsync(id, cancellationToken);
    }

    public async Task<bool> IncrementCopiesAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _repo.IncrementCopiesAsync(id, cancellationToken);
    }

    public async Task<int?> GetAvailabilityAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var book = await _repo.GetByIdAsync(id, cancellationToken);
        return book?.AvailableCopies;
    }

    private static BookResponseDto ToResponseDto(Book book) =>
        new BookResponseDto()
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author,
            Isbn = book.Isbn,
            Category = book.Category,
            AvailableCopies = book.AvailableCopies,
            TotalCopies = book.TotalCopies,
            CreatedAt = book.CreatedAt,
            UpdatedAt = book.UpdatedAt
        };
}
