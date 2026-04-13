namespace CatalogService.Application.Queries;

public record GetAllBooksQuery();
public record GetBookByIdQuery(Guid Id);
public record SearchBooksQuery(string Query);
