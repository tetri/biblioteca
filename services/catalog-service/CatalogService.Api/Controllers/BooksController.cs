using CatalogService.Application.Abstractions;
using CatalogService.Application.Commands;
using CatalogService.Application.DTOs;
using CatalogService.Application.Queries;
using Microsoft.AspNetCore.Mvc;

namespace CatalogService.Api.Controllers;

[ApiController]
[Route("api/catalog/[controller]")]
public class BooksController : ControllerBase
{
    private readonly ICommandHandler<CreateBookCommand, BookResponseDto> _createHandler;
    private readonly IQueryHandler<GetAllBooksQuery, IEnumerable<BookResponseDto>> _getAllHandler;
    private readonly IQueryHandler<GetBookByIdQuery, BookResponseDto?> _getByIdHandler;
    private readonly IQueryHandler<SearchBooksQuery, IEnumerable<BookResponseDto>> _searchHandler;

    public BooksController(
        ICommandHandler<CreateBookCommand, BookResponseDto> createHandler,
        IQueryHandler<GetAllBooksQuery, IEnumerable<BookResponseDto>> getAllHandler,
        IQueryHandler<GetBookByIdQuery, BookResponseDto?> getByIdHandler,
        IQueryHandler<SearchBooksQuery, IEnumerable<BookResponseDto>> searchHandler)
    {
        _createHandler = createHandler;
        _getAllHandler = getAllHandler;
        _getByIdHandler = getByIdHandler;
        _searchHandler = searchHandler;
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
}
