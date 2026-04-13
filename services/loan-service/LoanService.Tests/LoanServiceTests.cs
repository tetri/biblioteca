using LoanService.Application.DTOs;
using LoanService.Domain.Entities;
using LoanService.Domain.Repositories;
using Moq;
using FluentAssertions;

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
        _repositoryMock.Setup(r => r.GetByUserIdAsync(It.IsAny<Guid>())).ReturnsAsync(new List<Loan>());
        var dto = new CreateLoanDto(Guid.NewGuid(), Guid.NewGuid());

        var result = await _service.CreateLoanAsync(dto);

        result.Should().NotBeNull();
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Loan>()), Times.Once);
    }

    [Fact]
    public async Task CreateLoanAsync_ShouldThrowException_WhenUserHas3ActiveLoans()
    {
        var userId = Guid.NewGuid();
        var existingLoans = Enumerable.Repeat(new Loan { Status = LoanStatus.Active }, 3).ToList();
        _repositoryMock.Setup(r => r.GetByUserIdAsync(userId)).ReturnsAsync(existingLoans);

        var dto = new CreateLoanDto(userId, Guid.NewGuid());

        await _service.Invoking(s => s.CreateLoanAsync(dto))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Usuário atingiu o limite máximo de empréstimos ativos.");
    }

    [Fact]
    public async Task CreateLoanAsync_ShouldThrowException_WhenUserHasOverdueLoan()
    {
        var userId = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByUserIdAsync(userId)).ReturnsAsync(new List<Loan> { new Loan { Status = LoanStatus.Overdue } });

        var dto = new CreateLoanDto(userId, Guid.NewGuid());

        await _service.Invoking(s => s.CreateLoanAsync(dto))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Usuário possui empréstimos em atraso.");
    }
}
