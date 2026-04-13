using CatalogService.Application.Abstractions;
using CatalogService.Application.Commands;
using CatalogService.Application.DTOs;
using CatalogService.Domain.Entities;
using CatalogService.Domain.Repositories;

namespace CatalogService.Application.Handlers;

public class CreateBookHandler : ICommandHandler<CreateBookCommand, BookResponseDto>
{
    private readonly IBookRepository _repo;

    public CreateBookHandler(IBookRepository repo)
    {
        _repo = repo;
    }

    public async Task<BookResponseDto> Handle(CreateBookCommand command, CancellationToken ct)
    {
        var book = new Book(
            command.Title,
            command.Author,
            command.Isbn,
            command.Category,
            command.AvailableCopies,
            command.TotalCopies
        );

        await _repo.AddAsync(book, ct);

        return new BookResponseDto
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
}
