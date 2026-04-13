using NotificationService.Application.Services;
using NotificationService.Domain.Interfaces;
using Moq;
using FluentAssertions;

namespace NotificationService.Tests;

public class NotificationServiceTests
{
    private readonly Mock<INotificationProvider> _providerMock;
    private readonly NotificationService.Application.Services.NotificationService _service;

    public NotificationServiceTests()
    {
        _providerMock = new Mock<INotificationProvider>();
        _service = new NotificationService.Application.Services.NotificationService(_providerMock.Object);
    }

    [Fact]
    public async Task SendNotificationAsync_ShouldCallProvider()
    {
        // Act
        await _service.SendNotificationAsync("user-id", "message");

        // Assert
        _providerMock.Verify(p => p.SendAsync(It.IsAny<string>(), It.IsAny<string>()), Times.Once);
    }
}
