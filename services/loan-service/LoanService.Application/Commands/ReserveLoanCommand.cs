namespace LoanService.Application.Commands;

public record ReserveLoanCommand(Guid UserId, Guid BookId);
