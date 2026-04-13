namespace LoanService.Infrastructure.Repositories;

using LoanService.Domain.Entities;
using LoanService.Domain.Repositories;
using MongoDB.Driver;

public class LoanRepository : ILoanRepository
{
    private readonly IMongoCollection<Loan> _loans;

    public LoanRepository(MongoContext context)
    {
        _loans = context.Loans;
    }

    public async Task<Loan?> GetByIdAsync(Guid id) =>
        await _loans.Find(l => l.Id == id).FirstOrDefaultAsync();

    public async Task<IEnumerable<Loan>> GetByUserIdAsync(Guid userId) =>
        await _loans.Find(l => l.UserId == userId).ToListAsync();

    public async Task AddAsync(Loan loan) => await _loans.InsertOneAsync(loan);

    public async Task UpdateAsync(Loan loan) =>
        await _loans.ReplaceOneAsync(l => l.Id == loan.Id, loan);
}
