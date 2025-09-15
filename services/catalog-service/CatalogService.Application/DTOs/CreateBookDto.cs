namespace CatalogService.Application.DTOs
{
    public class CreateBookDto
    {
        public string Title { get; set; } = default!;
        public string Author { get; set; } = default!;
        public string Isbn { get; set; } = default!;
        public string Category { get; set; } = default!;
        public int TotalCopies { get; set; }
        public int AvailableCopies { get; set; }
    }
}
