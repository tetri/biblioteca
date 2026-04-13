using CatalogService.Application.Abstractions;
using CatalogService.Application.Commands;
using CatalogService.Application.DTOs;
using CatalogService.Application.Queries;
using Microsoft.AspNetCore.Mvc;
using Shared.Contracts;

namespace CatalogService.Api.Controllers;

[ApiController]
[Route("api/catalog/[controller]")]
public class BooksController : ControllerBase
{
    private readonly ICommandHandler<CreateBookCommand, BookResponseDto> _createHandler;
    private readonly IQueryHandler<GetAllBooksQuery, IEnumerable<BookResponseDto>> _getAllHandler;
    private readonly IQueryHandler<GetBookByIdQuery, BookResponseDto?> _getByIdHandler;
    private readonly IQueryHandler<SearchBooksQuery, IEnumerable<BookResponseDto>> _searchHandler;

    private readonly ICommandHandler<UpdateBookCommand, Result<BookResponseDto>> _updateHandler;
    private readonly ICommandHandler<DeleteBookCommand, Result<bool>> _deleteHandler;

    public BooksController(
        ICommandHandler<CreateBookCommand, BookResponseDto> createHandler,
        IQueryHandler<GetAllBooksQuery, IEnumerable<BookResponseDto>> getAllHandler,
        IQueryHandler<GetBookByIdQuery, BookResponseDto?> getByIdHandler,
        IQueryHandler<SearchBooksQuery, IEnumerable<BookResponseDto>> searchHandler,
        ICommandHandler<UpdateBookCommand, Result<BookResponseDto>> updateHandler,
        ICommandHandler<DeleteBookCommand, Result<bool>> deleteHandler)
    {
        _createHandler = createHandler;
        _getAllHandler = getAllHandler;
        _getByIdHandler = getByIdHandler;
        _searchHandler = searchHandler;
        _updateHandler = updateHandler;
        _deleteHandler = deleteHandler;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookCommand command, CancellationToken ct)
    {
        var result = await _createHandler.Handle(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct) => Ok(await _getAllHandler.Handle(new(), ct));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _getByIdHandler.Handle(new(id), ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string query, CancellationToken ct)
    {
        return Ok(await _searchHandler.Handle(new(query), ct));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBookCommand command, CancellationToken ct)
    {
        if (id != command.Id) return BadRequest("ID mismatch");
        var result = await _updateHandler.Handle(command, ct);
        return result.IsFailure ? NotFound(result.Error) : Ok(result.Value);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var result = await _deleteHandler.Handle(new(id), ct);
        return result.IsFailure ? NotFound(result.Error) : NoContent();
    }
}
