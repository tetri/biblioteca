using Shared.Contracts;

namespace LoanService.Domain.Entities;

public enum LoanStatus
{
    Reserved,
    Active,
    Returned,
    Overdue
}

public class Loan
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid UserId { get; private set; }
    public Guid BookId { get; private set; }
    public DateTime LoanDate { get; private set; }
    public DateTime DueDate { get; private set; }
    public DateTime? ReturnDate { get; private set; }
    public LoanStatus Status { get; private set; }

    private Loan() { }

    public static Result<Loan> Create(Guid userId, Guid bookId, IEnumerable<Loan> existingLoans)
    {
        if (existingLoans.Count(l => l.Status == LoanStatus.Active) >= 3)
            return Result<Loan>.Failure("Usuário atingiu o limite máximo de empréstimos ativos.");

        if (existingLoans.Any(l => l.Status == LoanStatus.Overdue))
            return Result<Loan>.Failure("Usuário possui empréstimos em atraso.");

        if (existingLoans.Any(l => l.BookId == bookId && (l.Status == LoanStatus.Reserved || l.Status == LoanStatus.Active)))
            return Result<Loan>.Failure("Usuário já possui uma reserva ou empréstimo ativo para este livro.");

        var loan = new Loan
        {
            UserId = userId,
            BookId = bookId,
            LoanDate = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(14),
            Status = LoanStatus.Active
        };

        return Result<Loan>.Success(loan);
    }

    public static Result<Loan> Reserve(Guid userId, Guid bookId, IEnumerable<Loan> existingLoans)
    {
        if (existingLoans.Any(l => l.Status == LoanStatus.Overdue))
            return Result<Loan>.Failure("Usuário possui empréstimos em atraso.");

        var loan = new Loan
        {
            UserId = userId,
            BookId = bookId,
            Status = LoanStatus.Reserved
        };

        return Result<Loan>.Success(loan);
    }
}
