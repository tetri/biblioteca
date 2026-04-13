namespace CatalogService.Application.Commands;

public record CreateBookCommand(string Title, string Author, string Isbn, string Category, int AvailableCopies, int TotalCopies);
