using CatalogService.Application.Services;
using CatalogService.Domain.Repositories;
using Moq;
using FluentAssertions;

namespace CatalogService.Tests;

public class CatalogServiceTests
{
    private readonly Mock<IBookRepository> _repositoryMock;
    private readonly BookService _service;

    public CatalogServiceTests()
    {
        _repositoryMock = new Mock<IBookRepository>();
        _service = new BookService(_repositoryMock.Object);
    }

    [Fact]
    public async Task GetAllBooksAsync_ShouldReturnAllBooks()
    {
        _repositoryMock.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>())).ReturnsAsync(new List<Domain.Entities.Book>());
        
        var result = await _service.GetAllAsync();
        
        result.Should().NotBeNull();
    }
}
