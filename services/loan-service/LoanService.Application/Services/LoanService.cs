using LoanService.Application.DTOs;
using LoanService.Application.Interfaces;
using LoanService.Domain.Entities;
using LoanService.Domain.Repositories;

namespace LoanService.Application.Services;

public class LoanService : ILoanService
{
    private readonly ILoanRepository _loanRepository;

    public LoanService(ILoanRepository loanRepository)
    {
        _loanRepository = loanRepository;
    }

    public async Task<LoanResponseDto> CreateLoanAsync(CreateLoanDto createLoanDto)
    {
        var existingLoans = (await _loanRepository.GetByUserIdAsync(createLoanDto.UserId)).ToList();

        // Regra: Limite de 3 empréstimos ativos
        if (existingLoans.Count(l => l.Status == LoanStatus.Active) >= 3)
        {
            throw new InvalidOperationException("Usuário atingiu o limite máximo de empréstimos ativos.");
        }

        // Regra: Usuários com Overdue não podem pegar novos livros
        if (existingLoans.Any(l => l.Status == LoanStatus.Overdue))
        {
            throw new InvalidOperationException("Usuário possui empréstimos em atraso.");
        }

        var loan = new Loan
        {
            UserId = createLoanDto.UserId,
            BookId = createLoanDto.BookId,
            LoanDate = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(14),
            Status = LoanStatus.Active
        };

        await _loanRepository.AddAsync(loan);

        return new LoanResponseDto(loan.Id, loan.UserId, loan.BookId, loan.LoanDate, loan.DueDate, loan.Status.ToString());
    }

    public async Task<LoanResponseDto?> GetLoanAsync(Guid id)
    {
        var loan = await _loanRepository.GetByIdAsync(id);
        if (loan == null) return null;

        return new LoanResponseDto(loan.Id, loan.UserId, loan.BookId, loan.LoanDate, loan.DueDate, loan.Status.ToString());
    }
}
