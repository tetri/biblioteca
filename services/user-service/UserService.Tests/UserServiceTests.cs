using FluentAssertions;
using Moq;
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
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>())).ReturnsAsync((UserService.Domain.Entities.User?)null);

        var result = await _service.GetProfileAsync(Guid.NewGuid());

        result.Should().BeNull();
    }
}
