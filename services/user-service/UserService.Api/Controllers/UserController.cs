using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using UserService.Api.DTOs;
using UserService.Application.Interfaces;
using UserService.Infrastructure.Security;

namespace UserService.Api.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly JwtSettings _jwtSettings;

        public UsersController(
            IUserService userService,
            IOptions<JwtSettings> jwtSettings)
        {
            _userService = userService;
            _jwtSettings = jwtSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
        {
            var result = await _userService.RegisterAsync(request.Name, request.Email, request.Password);
            return Ok(new UserProfileResponse
            {
                Id = result.Id,
                Name = result.Name,
                Email = result.Email
            });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _userService.LoginAsync(request.Email, request.Password);
            var expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes);

            return Ok(new
            {
                token,
                expiresAt
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = GetAuthenticatedUserId();
            if (userId == null)
                return Unauthorized(new { message = "Token de autenticacao invalido." });

            var profile = await _userService.GetProfileAsync(userId.Value);
            if (profile == null)
                return NotFound(new { message = "Usuario nao encontrado." });

            return Ok(profile);
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe(UpdateUserRequest request)
        {
            var userId = GetAuthenticatedUserId();
            if (userId == null)
                return Unauthorized(new { message = "Token de autenticacao invalido." });

            var profile = await _userService.UpdateProfileAsync(userId.Value, request.Name, request.Password);
            if (profile == null)
                return NotFound(new { message = "Usuario nao encontrado." });

            return Ok(profile);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetUsersForAdmin([FromQuery] string? search, [FromQuery] bool? isApproved, [FromQuery] string? role)
        {
            var users = await _userService.GetUsersForAdminAsync(search, isApproved, role);
            return Ok(users);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("admin/{userId:guid}/approve")]
        public async Task<IActionResult> ApproveUser(Guid userId)
        {
            var user = await _userService.ApproveUserAsync(userId);
            return Ok(user);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("admin/{userId:guid}/role")]
        public async Task<IActionResult> UpdateUserRole(Guid userId, [FromBody] UpdateUserRoleRequest request)
        {
            var user = await _userService.UpdateUserRoleAsync(userId, request.Role);
            return Ok(user);
        }

        private Guid? GetAuthenticatedUserId()
        {
            var sid = User.FindFirst(JwtRegisteredClaimNames.Sid)?.Value;
            if (sid == null)
                return null;

            return Guid.TryParse(sid, out var userId) ? userId : null;
        }
    }
}
