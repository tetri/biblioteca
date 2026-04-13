namespace LoanService.Application.Commands;

public record CreateLoanCommand(Guid UserId, Guid BookId);
