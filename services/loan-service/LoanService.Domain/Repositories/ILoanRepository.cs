namespace LoanService.Domain.Repositories;

using LoanService.Domain.Entities;

public interface ILoanRepository
{
    Task<Loan?> GetByIdAsync(Guid id);
    Task<IEnumerable<Loan>> GetByUserIdAsync(Guid userId);
    Task AddAsync(Loan loan);
    Task UpdateAsync(Loan loan);
}
