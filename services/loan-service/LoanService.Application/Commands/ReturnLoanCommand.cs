namespace LoanService.Application.Commands;

public record ReturnLoanCommand(Guid LoanId, Guid UserId);