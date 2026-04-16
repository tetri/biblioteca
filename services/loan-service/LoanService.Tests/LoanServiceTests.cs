using FluentAssertions;
using LoanService.Application.Commands;
using LoanService.Domain.Entities;
using LoanService.Domain.Repositories;
using Moq;

namespace LoanService.Tests;

public class LoanServiceTests
{
    private readonly Mock<ILoanRepository> _repositoryMock;
    private readonly LoanService.Application.Services.LoanService _service;

    public LoanServiceTests()
    {
        _repositoryMock = new Mock<ILoanRepository>();
        _service = new LoanService.Application.Services.LoanService(_repositoryMock.Object);
    }

    [Fact]
    public async Task CreateLoanAsync_ShouldCreateLoan_WhenValidRequest()
    {
        _repositoryMock.Setup(r => r.GetByUserIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>())).ReturnsAsync(new List<Loan>());
        var command = new CreateLoanCommand(Guid.NewGuid(), Guid.NewGuid());

        var result = await _service.Handle(command);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeNull();
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Loan>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateLoanAsync_ShouldReturnFailure_WhenUserHas3ActiveLoans()
    {
        var userId = Guid.NewGuid();
        // Corrigindo a criação de Loan para o teste usando a factory
        var existingLoanResult = Loan.Create(userId, Guid.NewGuid(), new List<Loan>());
        existingLoanResult.IsSuccess.Should().BeTrue(existingLoanResult.Error);
        var existingLoan = existingLoanResult.Value!;
        var existingLoans = Enumerable.Repeat(existingLoan, 3).ToList();
        _repositoryMock.Setup(r => r.GetByUserIdAsync(userId, It.IsAny<CancellationToken>())).ReturnsAsync(existingLoans);

        var command = new CreateLoanCommand(userId, Guid.NewGuid());

        var result = await _service.Handle(command);

        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be("Usuário atingiu o limite máximo de empréstimos ativos.");
    }
}

