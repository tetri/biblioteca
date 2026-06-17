using LoanService.Application.Abstractions;
using LoanService.Application.Commands;
using LoanService.Application.DTOs;
using LoanService.Domain.Entities;
using LoanService.Domain.Repositories;
using Shared.Contracts;
using System.Net.Http;

namespace LoanService.Application.Handlers;

public class CreateLoanHandler : ICommandHandler<CreateLoanCommand, Result<LoanResponseDto>>
{
    private readonly ILoanRepository _loanRepository;
    private readonly IHttpClientFactory _httpClientFactory;

    public CreateLoanHandler(ILoanRepository loanRepository, IHttpClientFactory httpClientFactory)
    {
        _loanRepository = loanRepository;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<Result<LoanResponseDto>> Handle(CreateLoanCommand command, CancellationToken cancellationToken = default)
    {
        var existingLoans = await _loanRepository.GetByUserIdAsync(command.UserId, cancellationToken);

        var result = Loan.Create(command.UserId, command.BookId, existingLoans);

        if (result.IsFailure)
        {
            return Result<LoanResponseDto>.Failure(result.Error!);
        }

        var httpClient = _httpClientFactory.CreateClient("CatalogService");
        var bookResponse = await httpClient.GetAsync($"api/books/{command.BookId}", cancellationToken);

        if (!bookResponse.IsSuccessStatusCode)
        {
            return Result<LoanResponseDto>.Failure("Livro não encontrado.");
        }

        var loan = result.Value!;
        await _loanRepository.AddAsync(loan, cancellationToken);

        return Result<LoanResponseDto>.Success(new LoanResponseDto(loan.Id, loan.UserId, loan.BookId, loan.LoanDate, loan.DueDate, loan.Status.ToString()));
    }
}
