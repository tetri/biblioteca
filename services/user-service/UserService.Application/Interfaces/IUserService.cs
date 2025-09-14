using UserService.Application.DTOs;

namespace UserService.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileDto> RegisterAsync(string name, string email, string password);
        Task<string> LoginAsync(string email, string password);
        Task<UserProfileDto?> GetProfileAsync(Guid userId);
        Task<UserProfileDto?> UpdateProfileAsync(Guid userId, string? name, string? password);
    }
}
