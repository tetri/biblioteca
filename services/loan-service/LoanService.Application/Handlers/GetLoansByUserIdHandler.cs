using LoanService.Application.Abstractions;
using LoanService.Application.DTOs;
using LoanService.Application.Queries;
using LoanService.Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace LoanService.Application.Handlers;

public class GetLoansByUserIdHandler : IQueryHandler<GetLoansByUserIdQuery, IEnumerable<LoanResponseDto>>
{
    private readonly ILoanRepository _loanRepository;
    private readonly ILogger<GetLoansByUserIdHandler> _logger;

    public GetLoansByUserIdHandler(ILoanRepository loanRepository, ILogger<GetLoansByUserIdHandler> logger)
    {
        _loanRepository = loanRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<LoanResponseDto>> Handle(GetLoansByUserIdQuery query, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching loans for user {UserId}", query.UserId);
        var loans = await _loanRepository.GetByUserIdAsync(query.UserId, cancellationToken);
        return loans.Select(l => new LoanResponseDto(
            l.Id,
            l.UserId,
            l.BookId,
            l.LoanDate,
            l.DueDate,
            l.Status.ToString()));
    }
}
