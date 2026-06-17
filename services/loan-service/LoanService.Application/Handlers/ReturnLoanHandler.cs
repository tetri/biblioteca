using LoanService.Application.Abstractions;
using LoanService.Application.Commands;
using LoanService.Application.DTOs;
using LoanService.Domain.Entities;
using LoanService.Domain.Repositories;
using Shared.Contracts;

namespace LoanService.Application.Handlers;

public class ReturnLoanHandler : ICommandHandler<ReturnLoanCommand, Result<LoanResponseDto>>
{
    private readonly ILoanRepository _loanRepository;

    public ReturnLoanHandler(ILoanRepository loanRepository)
    {
        _loanRepository = loanRepository;
    }

    public async Task<Result<LoanResponseDto>> Handle(ReturnLoanCommand command, CancellationToken cancellationToken = default)
    {
        var existingLoans = await _loanRepository.GetByUserIdAsync(command.UserId, cancellationToken);

        var result = Loan.Return(command.LoanId, existingLoans);

        if (result.IsFailure)
        {
            return Result<LoanResponseDto>.Failure(result.Error!);
        }

        var loan = result.Value!;
        await _loanRepository.UpdateAsync(loan, cancellationToken);

        return Result<LoanResponseDto>.Success(new LoanResponseDto(loan.Id, loan.UserId, loan.BookId, loan.LoanDate, loan.DueDate, loan.Status.ToString()));
    }
}