namespace CatalogService.Application.DTOs
{
    public class BookResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = default!;
        public string Author { get; set; } = default!;
        public string Isbn { get; set; } = default!;
        public string Category { get; set; } = default!;
        public int AvailableCopies { get; set; }
        public int TotalCopies { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
