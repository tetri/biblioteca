using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Contracts;
using UserService.Api.DTOs;
using UserService.Application.Abstractions;
using UserService.Application.Commands;
using UserService.Application.Interfaces;

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

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
    {
        var result = await _userService.RegisterAsync(request.Name, request.Email, request.Password);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var token = await _userService.LoginAsync(request.Email, request.Password);
        return Ok(new { token });
    }

    [AllowAnonymous]
    [HttpPost("setup-password")]
    public async Task<IActionResult> SetupPassword([FromBody] SetupPasswordCommand command, CancellationToken cancellationToken)
    {
        var result = await _setupPasswordHandler.Handle(command, cancellationToken);
        return result.IsFailure ? BadRequest(new { message = result.Error }) : Ok(result.Value);
    }
}
