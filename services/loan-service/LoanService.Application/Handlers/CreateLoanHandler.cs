using LoanService.Application.Abstractions;
using LoanService.Application.Commands;
using LoanService.Application.DTOs;
using LoanService.Domain.Entities;
using LoanService.Domain.Repositories;

namespace LoanService.Application.Handlers;

public class CreateLoanHandler : ICommandHandler<CreateLoanCommand, LoanResponseDto>
{
    private readonly ILoanRepository _loanRepository;

    public CreateLoanHandler(ILoanRepository loanRepository)
    {
        _loanRepository = loanRepository;
    }

    public async Task<LoanResponseDto> Handle(CreateLoanCommand command)
    {
        var existingLoans = (await _loanRepository.GetByUserIdAsync(command.UserId)).ToList();

        if (existingLoans.Count(l => l.Status == LoanStatus.Active) >= 3)
        {
            throw new InvalidOperationException("Usuário atingiu o limite máximo de empréstimos ativos.");
        }

        if (existingLoans.Any(l => l.Status == LoanStatus.Overdue))
        {
            throw new InvalidOperationException("Usuário possui empréstimos em atraso.");
        }

        var loan = new Loan
        {
            UserId = command.UserId,
            BookId = command.BookId,
            LoanDate = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(14),
            Status = LoanStatus.Active
        };

        await _loanRepository.AddAsync(loan);

        return new LoanResponseDto(loan.Id, loan.UserId, loan.BookId, loan.LoanDate, loan.DueDate, loan.Status.ToString());
    }
}
