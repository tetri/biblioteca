using FluentAssertions;
using Moq;
using UserService.Application.Exceptions;
using UserService.Domain.Repositories;
using UserService.Domain.Services;

namespace UserService.Tests;

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _repositoryMock;
    private readonly Mock<IPasswordHasher> _passwordHasherMock;
    private readonly Mock<IJwtProvider> _jwtProviderMock;
    private readonly UserService.Application.Services.UserService _service;

    public UserServiceTests()
    {
        _repositoryMock = new Mock<IUserRepository>();
        _passwordHasherMock = new Mock<IPasswordHasher>();
        _jwtProviderMock = new Mock<IJwtProvider>();
        _service = new UserService.Application.Services.UserService(_repositoryMock.Object, _passwordHasherMock.Object, _jwtProviderMock.Object);
    }

    [Fact]
    public async Task GetProfileAsync_ShouldReturnNull_WhenUserDoesNotExist()
    {
        _repositoryMock
            .Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((UserService.Domain.Entities.User?)null);

        var result = await _service.GetProfileAsync(Guid.NewGuid());

        result.Should().BeNull();
    }

    [Fact]
    public async Task LoginAsync_ShouldThrowUserNotApprovedException_WhenUserIsPendingApproval()
    {
        var user = new UserService.Domain.Entities.User("Novo Usuario", "novo@biblioteca.com", "hash", "Member", false);

        _repositoryMock
            .Setup(r => r.GetByEmailAsync("novo@biblioteca.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        _passwordHasherMock
            .Setup(h => h.VerifyPassword("senha123", "hash"))
            .Returns(true);

        var act = async () => await _service.LoginAsync("novo@biblioteca.com", "senha123");

        await act.Should().ThrowAsync<UserNotApprovedException>();
    }

    [Fact]
    public async Task ApproveUserAsync_ShouldApprovePendingUser()
    {
        var user = new UserService.Domain.Entities.User("Novo Usuario", "novo@biblioteca.com", "hash", "Member", false);

        _repositoryMock
            .Setup(r => r.GetByIdAsync(user.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var result = await _service.ApproveUserAsync(user.Id);

        result.IsApproved.Should().BeTrue();
        _repositoryMock.Verify(r => r.UpdateAsync(user, It.IsAny<CancellationToken>()), Times.Once);
    }
}
