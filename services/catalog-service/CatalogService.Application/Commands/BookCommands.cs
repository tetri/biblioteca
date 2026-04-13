namespace CatalogService.Application.Commands;

public record UpdateBookCommand(Guid Id, string Title, string Author, string Isbn, string Category, int AvailableCopies, int TotalCopies);
public record DeleteBookCommand(Guid Id);
