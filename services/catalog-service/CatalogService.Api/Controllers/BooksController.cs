using CatalogService.Application.DTOs;
using CatalogService.Application.Interfaces;

using Microsoft.AspNetCore.Mvc;

namespace CatalogService.Api.Controllers;

[ApiController]
[Route("api/catalog/[controller]")]
public class BooksController : ControllerBase
{
    private readonly IBookService _bookService;

    public BooksController(IBookService bookService)
    {
        _bookService = bookService;
    }

    // POST /api/catalog/books
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookDto dto)
    {
        var created = await _bookService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /api/catalog/books/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBookDto dto)
    {
        var updated = await _bookService.UpdateAsync(id, dto);
        return updated == null ? NotFound() : Ok(updated);
    }

    // DELETE /api/catalog/books/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _bookService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    // GET /api/catalog/books
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var books = await _bookService.GetAllAsync();
        return Ok(books);
    }

    // GET /api/catalog/books/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var book = await _bookService.GetByIdAsync(id);
        return book == null ? NotFound() : Ok(book);
    }

    // GET /api/catalog/books/search?query=...
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        var results = await _bookService.SearchAsync(query);
        return Ok(results);
    }

    // GET /api/catalog/books/{id}/availability
    [HttpGet("{id:guid}/availability")]
    public async Task<IActionResult> Availability(Guid id)
    {
        var available = await _bookService.GetAvailabilityAsync(id);
        return available == null ? NotFound() : Ok(available);
    }

    // PUT /api/catalog/books/{id}/decrement
    [HttpPut("{id:guid}/decrement")]
    public async Task<IActionResult> Decrement(Guid id)
    {
        var success = await _bookService.DecrementCopiesAsync(id);
        return success ? Ok() : BadRequest("No available copies to decrement.");
    }

    // PUT /api/catalog/books/{id}/increment
    [HttpPut("{id:guid}/increment")]
    public async Task<IActionResult> Increment(Guid id)
    {
        var success = await _bookService.IncrementCopiesAsync(id);
        return success ? Ok() : NotFound();
    }
}
