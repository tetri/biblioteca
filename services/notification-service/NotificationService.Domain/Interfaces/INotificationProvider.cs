namespace NotificationService.Domain.Interfaces;

public interface INotificationProvider
{
    Task SendAsync(string userId, string message);
}
