namespace CatalogService.Domain.Entities
{
    public sealed class Book
    {
        public Guid Id { get; private set; }
        public string Title { get; private set; } = default!;
        public string Author { get; private set; } = default!;
        public string Isbn { get; private set; } = default!;
        public string Category { get; private set; } = default!;
        public int AvailableCopies { get; private set; }
        public int TotalCopies { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }

        public Book() { }

        public Book(string title, string author, string isbn, string category, int totalCopies, int availableCopies)
        {
            Id = Guid.NewGuid();
            Title = title;
            Author = author;
            Isbn = isbn;
            Category = category;
            TotalCopies = totalCopies;
            AvailableCopies = availableCopies;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Update(string title, string author, string isbn, string category, int totalCopies, int availableCopies)
        {
            Title = title;
            Author = author;
            Isbn = isbn;
            Category = category;
            TotalCopies = totalCopies;
            AvailableCopies = availableCopies;
            UpdatedAt = DateTime.UtcNow;
        }

        public bool DecrementStock()
        {
            if (AvailableCopies <= 0) return false;
            AvailableCopies--;
            UpdatedAt = DateTime.UtcNow;
            return true;
        }

        public void IncrementStock()
        {
            AvailableCopies++;
            UpdatedAt = DateTime.UtcNow;
        }
    }

}
