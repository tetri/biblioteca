using CatalogService.Application.Abstractions;
using CatalogService.Application.Commands;
using CatalogService.Domain.Repositories;
using Shared.Contracts;

namespace CatalogService.Application.Handlers;

public class DeleteBookHandler : ICommandHandler<DeleteBookCommand, Result<bool>>
{
    private readonly IBookRepository _repo;

    public DeleteBookHandler(IBookRepository repo) => _repo = repo;

    public async Task<Result<bool>> Handle(DeleteBookCommand command, CancellationToken ct)
    {
        var success = await _repo.DeleteAsync(command.Id, ct);
        return success ? Result<bool>.Success(true) : Result<bool>.Failure("Livro não encontrado.");
    }
}
