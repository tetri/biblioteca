using UserService.Application.DTOs;

namespace UserService.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileDto> RegisterAsync(string name, string email, string password);
        Task<string> LoginAsync(string email, string password);
        Task<UserProfileDto?> GetProfileAsync(Guid userId);
        Task<UserProfileDto?> UpdateProfileAsync(Guid userId, string? name, string? password);
        Task<IReadOnlyList<AdminUserDto>> GetUsersForAdminAsync(string? search, bool? isApproved, string? role);
        Task<AdminUserDto> ApproveUserAsync(Guid userId);
        Task<AdminUserDto> UpdateUserRoleAsync(Guid userId, string role);
    }
}
