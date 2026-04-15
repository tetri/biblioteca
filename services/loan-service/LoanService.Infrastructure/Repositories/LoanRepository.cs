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

    public async Task<Loan?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _loans.Find(l => l.Id == id).FirstOrDefaultAsync(cancellationToken);

    public async Task<IEnumerable<Loan>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) =>
        await _loans.Find(l => l.UserId == userId).ToListAsync(cancellationToken);

    public async Task AddAsync(Loan loan, CancellationToken cancellationToken = default) =>
        await _loans.InsertOneAsync(loan, cancellationToken: cancellationToken);

    public async Task UpdateAsync(Loan loan, CancellationToken cancellationToken = default) =>
        await _loans.ReplaceOneAsync(l => l.Id == loan.Id, loan, cancellationToken: cancellationToken);
}
