using System.IdentityModel.Tokens.Jwt;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

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

        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var sid = User.FindFirst(JwtRegisteredClaimNames.Sid)?.Value;
            if (sid == null)
                return Unauthorized();

            if (!Guid.TryParse(sid, out var userId))
                return BadRequest("Invalid user ID in token.");

            var profile = await _userService.GetProfileAsync(userId);
            if (profile == null) return NotFound();

            return Ok(profile);
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe(UpdateUserRequest request)
        {
            var sid = User.FindFirst(JwtRegisteredClaimNames.Sid)?.Value;
            if (sid == null)
                return Unauthorized();

            if (!Guid.TryParse(sid, out var userId))
                return BadRequest("Invalid user ID in token.");

            var profile = await _userService.UpdateProfileAsync(userId, request.Name, request.Password);
            if (profile == null) return NotFound();

            return Ok(profile);
        }
    }
}
