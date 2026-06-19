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
        var validationErrors = command.Validate().ToList();
        if (validationErrors.Count > 0)
            return Result<LoanResponseDto>.Failure(string.Join(" ", validationErrors));

        var existingLoans = await _loanRepository.GetByUserIdAsync(command.UserId, cancellationToken);

        var result = Loan.Create(command.UserId, command.BookId, existingLoans);

        if (result.IsFailure)
        {
            return Result<LoanResponseDto>.Failure(result.Error!);
        }

        var httpClient = _httpClientFactory.CreateClient("CatalogService");
        try
        {
            var bookResponse = await httpClient.GetAsync($"api/books/{command.BookId}", cancellationToken);

            if (!bookResponse.IsSuccessStatusCode)
            {
                if (bookResponse.StatusCode == System.Net.HttpStatusCode.ServiceUnavailable)
                    return Result<LoanResponseDto>.Failure("Serviço de catálogo indisponível. Tente novamente em instantes.");

                return Result<LoanResponseDto>.Failure("Livro não encontrado.");
            }
        }
        catch (HttpRequestException)
        {
            return Result<LoanResponseDto>.Failure("Serviço de catálogo indisponível. Tente novamente em instantes.");
        }
        catch (TaskCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            return Result<LoanResponseDto>.Failure("Timeout ao verificar disponibilidade do livro.");
        }

        var loan = result.Value!;
        await _loanRepository.AddAsync(loan, cancellationToken);

        return Result<LoanResponseDto>.Success(new LoanResponseDto(loan.Id, loan.UserId, loan.BookId, loan.LoanDate, loan.DueDate, loan.Status.ToString()));
    }
}
