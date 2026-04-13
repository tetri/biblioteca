using CatalogService.Application.DTOs;
using FluentAssertions;
using System.Text.Json;

namespace Shared.Tests.Contracts;

public class LoanToCatalogContractTests
{
    [Fact]
    public void LoanResponseDto_ShouldBeCompatibleWith_CatalogResponseSchema()
    {
        // O LoanService espera que o CatalogService retorne uma estrutura de Book,
        // mas aqui vamos validar o schema do que o LoanService consome do Catalog.

        var bookSchema = new
        {
            Id = Guid.NewGuid(),
            Title = "Test Book",
            Author = "Author Name",
            AvailableCopies = 5
        };

        var json = JsonSerializer.Serialize(bookSchema);

        // Simula deserialização no LoanService
        var deserialized = JsonSerializer.Deserialize<BookResponseDto>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        deserialized.Should().NotBeNull();
        deserialized!.Id.Should().Be(bookSchema.Id);
    }
}
