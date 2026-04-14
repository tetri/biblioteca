using Microsoft.AspNetCore.Mvc;
using UserService.Application.Abstractions;
using UserService.Application.Commands;
using UserService.Application.Interfaces;
using Shared.Contracts;

namespace UserService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ICommandHandler<SetupPasswordCommand, Result<bool>> _setupPasswordHandler;

    public AuthController(IUserService userService, ICommandHandler<SetupPasswordCommand, Result<bool>> setupPasswordHandler)
    {
        _userService = userService;
        _setupPasswordHandler = setupPasswordHandler;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _userService.RegisterAsync(request.Name, request.Email, request.Password);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var token = await _userService.LoginAsync(request.Email, request.Password);
        return Ok(new { Token = token });
    }

    [HttpPost("setup-password")]
    public async Task<IActionResult> SetupPassword([FromBody] SetupPasswordCommand command)
    {
        var result = await _setupPasswordHandler.Handle(command);
        return result.IsFailure ? BadRequest(result.Error) : Ok(result.Value);
    }
}

public record RegisterRequest(string Name, string Email, string Password);
public record LoginRequest(string Email, string Password);
