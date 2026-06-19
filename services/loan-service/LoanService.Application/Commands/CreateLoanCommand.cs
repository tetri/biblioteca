namespace LoanService.Application.Commands;

public record CreateLoanCommand(Guid UserId, Guid BookId)
{
    public IEnumerable<string> Validate()
    {
        if (UserId == Guid.Empty)
            yield return "UserId é obrigatório.";
        if (BookId == Guid.Empty)
            yield return "BookId é obrigatório.";
    }
}
