using CatalogService.Application.Abstractions;
using CatalogService.Application.Commands;
using CatalogService.Application.DTOs;
using CatalogService.Domain.Entities;
using CatalogService.Domain.Repositories;
using Shared.Contracts;

namespace CatalogService.Application.Handlers;

public class UpdateBookHandler : ICommandHandler<UpdateBookCommand, Result<BookResponseDto>>
{
    private readonly IBookRepository _repo;

    public UpdateBookHandler(IBookRepository repo) => _repo = repo;

    public async Task<Result<BookResponseDto>> Handle(UpdateBookCommand command, CancellationToken ct)
    {
        var existing = await _repo.GetByIdAsync(command.Id, ct);
        if (existing is null) return Result<BookResponseDto>.Failure("Livro não encontrado.");

        existing.Update(
            command.Title,
            command.Author,
            command.Isbn,
            command.Category,
            command.TotalCopies,
            command.AvailableCopies
        );

        await _repo.UpdateAsync(existing, ct);
        return Result<BookResponseDto>.Success(ToDto(existing));
    }

    private static BookResponseDto ToDto(Book b) => new()
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
