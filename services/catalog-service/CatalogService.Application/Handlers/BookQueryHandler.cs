using CatalogService.Application.Abstractions;
using CatalogService.Application.DTOs;
using CatalogService.Application.Queries;
using CatalogService.Domain.Repositories;

namespace CatalogService.Application.Handlers;

public class BookQueryHandler :
    IQueryHandler<GetAllBooksQuery, IEnumerable<BookResponseDto>>,
    IQueryHandler<GetBookByIdQuery, BookResponseDto?>,
    IQueryHandler<SearchBooksQuery, IEnumerable<BookResponseDto>>
{
    private readonly IBookRepository _repo;

    public BookQueryHandler(IBookRepository repo) => _repo = repo;

    public async Task<IEnumerable<BookResponseDto>> Handle(GetAllBooksQuery query, CancellationToken ct)
    {
        var books = await _repo.GetAllAsync(ct);
        return books.Select(ToDto);
    }

    public async Task<BookResponseDto?> Handle(GetBookByIdQuery query, CancellationToken ct)
    {
        var book = await _repo.GetByIdAsync(query.Id, ct);
        return book is null ? null : ToDto(book);
    }

    public async Task<IEnumerable<BookResponseDto>> Handle(SearchBooksQuery query, CancellationToken ct)
    {
        var books = await _repo.SearchAsync(query.Query, ct);
        return books.Select(ToDto);
    }

    private static BookResponseDto ToDto(Domain.Entities.Book b) => new()
    {
        Id = b.Id,
        Title = b.Title,
        Author = b.Author,
        Isbn = b.Isbn,
        Category = b.Category,
        AvailableCopies = b.AvailableCopies,
        TotalCopies = b.TotalCopies,
        CreatedAt = b.CreatedAt,
        UpdatedAt = b.UpdatedAt
    };
}
