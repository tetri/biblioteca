namespace LoanService.Application.DTOs;

public record CreateLoanDto(Guid UserId, Guid BookId);
public record LoanResponseDto(Guid Id, Guid UserId, Guid BookId, DateTime LoanDate, DateTime DueDate, string Status);
