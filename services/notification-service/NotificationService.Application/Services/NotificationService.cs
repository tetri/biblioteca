using NotificationService.Domain.Interfaces;

namespace NotificationService.Application.Services;

public class NotificationService
{
    private readonly INotificationProvider _provider;

    public NotificationService(INotificationProvider provider)
    {
        _provider = provider;
    }

    public async Task SendNotificationAsync(string userId, string message)
    {
        await _provider.SendAsync(userId, message);
    }
}
