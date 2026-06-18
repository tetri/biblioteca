using UserService.Application.DTOs;
using UserService.Application.Exceptions;
using UserService.Application.Interfaces;
using UserService.Domain.Entities;
using UserService.Domain.Repositories;
using UserService.Domain.Services;

namespace UserService.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;

        public UserService(
            IUserRepository userRepository,
            IPasswordHasher passwordHasher,
            IJwtProvider jwtProvider)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtProvider = jwtProvider;
        }

        public async Task<UserProfileDto> RegisterAsync(string name, string email, string password)
        {
            var existing = await _userRepository.GetByEmailAsync(email);
            if (existing != null)
                throw new DuplicateEmailException(email);

            var user = new User(name, email, _passwordHasher.HashPassword(password), "Member");
            await _userRepository.AddAsync(user);

            return new UserProfileDto { Id = user.Id, Name = user.Name, Email = user.Email };
        }

        public async Task<string> LoginAsync(string email, string password)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null || !_passwordHasher.VerifyPassword(password, user.PasswordHash))
                throw new InvalidCredentialsException();

            if (!user.IsApproved)
                throw new UserNotApprovedException();

            return _jwtProvider.GenerateToken(user);
        }

        public async Task<UserProfileDto?> GetProfileAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return null;

            return new UserProfileDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email
            };
        }

        public async Task<UserProfileDto?> UpdateProfileAsync(Guid userId, string? name, string? password)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return null;

            if (!string.IsNullOrWhiteSpace(name))
                user.UpdateName(name);

            if (!string.IsNullOrWhiteSpace(password))
                user.UpdatePassword(_passwordHasher.HashPassword(password));

            await _userRepository.UpdateAsync(user);

            return new UserProfileDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email
            };
        }

        public async Task<IReadOnlyList<AdminUserDto>> GetUsersForAdminAsync(string? search, bool? isApproved, string? role)
        {
            var users = await _userRepository.GetAllAsync();
            var query = users.AsEnumerable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var normalizedSearch = search.Trim();
                query = query.Where(u =>
                    u.Name?.Contains(normalizedSearch, StringComparison.OrdinalIgnoreCase) == true ||
                    u.Email?.Contains(normalizedSearch, StringComparison.OrdinalIgnoreCase) == true);
            }

            if (isApproved.HasValue)
                query = query.Where(u => u.IsApproved == isApproved.Value);

            if (!string.IsNullOrWhiteSpace(role))
                query = query.Where(u => string.Equals(u.Role, role.Trim(), StringComparison.OrdinalIgnoreCase));

            return query.Select(MapToAdminUserDto).ToList();
        }

        public async Task<AdminUserDto> ApproveUserAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new UserNotFoundException(userId);

            if (!user.IsApproved)
            {
                user.Approve();
                await _userRepository.UpdateAsync(user);
            }

            return MapToAdminUserDto(user);
        }

        public async Task<AdminUserDto> UpdateUserRoleAsync(Guid userId, string role)
        {
            if (!IsSupportedRole(role))
                throw new InvalidUserRoleException(role);

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new UserNotFoundException(userId);

            user.UpdateRole(NormalizeRole(role));
            await _userRepository.UpdateAsync(user);

            return MapToAdminUserDto(user);
        }

        private static bool IsSupportedRole(string role)
        {
            return string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase)
                || string.Equals(role, "Member", StringComparison.OrdinalIgnoreCase);
        }

        private static string NormalizeRole(string role)
        {
            return string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase) ? "Admin" : "Member";
        }

        private static AdminUserDto MapToAdminUserDto(User user)
        {
            return new AdminUserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                IsApproved = user.IsApproved,
                IsSetupRequired = user.IsSetupRequired,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }
    }
}
