using FluentAssertions;
using LoanService.Domain.Entities;

namespace LoanService.Tests;

public class LoanReserveTests
{
    [Fact]
    public void Reserve_ShouldReturnFailure_WhenUserAlreadyHasActiveLoanForSameBook()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var bookId = Guid.NewGuid();
        var activeLoanResult = Loan.Create(userId, bookId, new List<Loan>());
        activeLoanResult.IsSuccess.Should().BeTrue(activeLoanResult.Error);
        var activeLoan = activeLoanResult.Value!;
        var existingLoans = new List<Loan> { activeLoan };

        // Act
        var result = Loan.Reserve(userId, bookId, existingLoans);

        // Assert
        result.IsFailure.Should().BeTrue("User already has an active loan for this book");
        result.Error.Should().Be("Usuário já possui uma reserva ou empréstimo ativo para este livro.");
    }

    [Fact]
    public void Reserve_ShouldReturnFailure_WhenUserAlreadyHasReservedLoanForSameBook()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var bookId = Guid.NewGuid();
        var reservedLoanResult = Loan.Reserve(userId, bookId, new List<Loan>());
        reservedLoanResult.IsSuccess.Should().BeTrue(reservedLoanResult.Error);
        var reservedLoan = reservedLoanResult.Value!;
        var existingLoans = new List<Loan> { reservedLoan };

        // Act
        var result = Loan.Reserve(userId, bookId, existingLoans);

        // Assert
        result.IsFailure.Should().BeTrue("User already has a reserved loan for this book");
        result.Error.Should().Be("Usuário já possui uma reserva ou empréstimo ativo para este livro.");
    }
}
