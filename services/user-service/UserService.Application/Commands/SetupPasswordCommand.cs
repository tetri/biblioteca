namespace UserService.Application.Commands;

public record SetupPasswordCommand(string Email, string CurrentPassword, string NewPassword);
