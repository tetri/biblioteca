using LoanService.Application.Commands;
using LoanService.Application.DTOs;
using LoanService.Application.Interfaces;
using LoanService.Domain.Entities;
using LoanService.Domain.Repositories;
using Shared.Contracts;

namespace LoanService.Application.Services;

public class LoanService : ILoanService
{
    private readonly ILoanRepository _loanRepository;

    public LoanService(ILoanRepository loanRepository)
    {
        _loanRepository = loanRepository;
    }

    public async Task<Result<LoanResponseDto>> Handle(CreateLoanCommand command)
    {
        var existingLoans = await _loanRepository.GetByUserIdAsync(command.UserId);

        var result = Loan.Create(command.UserId, command.BookId, existingLoans);

        if (result.IsFailure)
        {
            return Result<LoanResponseDto>.Failure(result.Error!);
        }

        var loan = result.Value!;
        await _loanRepository.AddAsync(loan);

        return Result<LoanResponseDto>.Success(new LoanResponseDto(loan.Id, loan.UserId, loan.BookId, loan.LoanDate, loan.DueDate, loan.Status.ToString()));
    }

    // Mantendo a interface para compatibilidade, embora o Handler deva ser o padrão
    public async Task<LoanResponseDto> CreateLoanAsync(CreateLoanDto createLoanDto)
    {
        throw new NotImplementedException("Use o Command Handler.");
    }

    public async Task<LoanResponseDto?> GetLoanAsync(Guid id)
    {
        var loan = await _loanRepository.GetByIdAsync(id);
        if (loan == null) return null;

        return new LoanResponseDto(loan.Id, loan.UserId, loan.BookId, loan.LoanDate, loan.DueDate, loan.Status.ToString());
    }
}
