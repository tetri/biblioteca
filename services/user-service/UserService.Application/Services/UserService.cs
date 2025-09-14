using UserService.Application.DTOs;
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
                throw new Exception("Email already registered.");

            var user = new User(name, email, _passwordHasher.HashPassword(password));
            await _userRepository.AddAsync(user);

            return new UserProfileDto { Id = user.Id, Name = user.Name, Email = user.Email };
        }

        public async Task<string> LoginAsync(string email, string password)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null || !_passwordHasher.VerifyPassword(password, user.PasswordHash))
                throw new Exception("Invalid credentials.");

            var token = _jwtProvider.GenerateToken(user);

            return token;
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

            if (!string.IsNullOrEmpty(name))
                user.UpdateName(name);

            if (!string.IsNullOrEmpty(password))
                user.UpdatePassword(_passwordHasher.HashPassword(password));

            await _userRepository.UpdateAsync(user);

            return new UserProfileDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email
            };
        }
    }
}
