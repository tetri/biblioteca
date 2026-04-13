namespace LoanService.Application.Interfaces;

using LoanService.Application.DTOs;

public interface ILoanService
{
    Task<LoanResponseDto> CreateLoanAsync(CreateLoanDto createLoanDto);
    Task<LoanResponseDto?> GetLoanAsync(Guid id);
}
