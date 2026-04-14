using LoanService.Application.Abstractions;
using LoanService.Application.Commands;
using LoanService.Application.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace LoanService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoansController : ControllerBase
{
    private readonly ICommandHandler<CreateLoanCommand, Shared.Contracts.Result<LoanResponseDto>> _createLoanHandler;
    private readonly ICommandHandler<ReserveLoanCommand, Shared.Contracts.Result<LoanResponseDto>> _reserveHandler;
    private readonly IQueryHandler<LoanService.Application.Queries.GetLoansByUserIdQuery, IEnumerable<LoanResponseDto>> _getLoansHandler;
    private readonly ILogger<LoansController> _logger;

    public LoansController(
        ICommandHandler<CreateLoanCommand, Shared.Contracts.Result<LoanResponseDto>> createLoanHandler,
        ICommandHandler<ReserveLoanCommand, Shared.Contracts.Result<LoanResponseDto>> reserveHandler,
        IQueryHandler<LoanService.Application.Queries.GetLoansByUserIdQuery, IEnumerable<LoanResponseDto>> getLoansHandler,
        ILogger<LoansController> logger)
    {
        _createLoanHandler = createLoanHandler;
        _reserveHandler = reserveHandler;
        _getLoansHandler = getLoansHandler;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<LoanResponseDto>> Create([FromBody] CreateLoanCommand command)
    {
        var result = await _createLoanHandler.Handle(command);

        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPost("reserve")]
    public async Task<ActionResult<LoanResponseDto>> Reserve([FromBody] ReserveLoanCommand command)
    {
        var result = await _reserveHandler.Handle(command);
        
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpGet("my-loans")]
    public async Task<ActionResult<IEnumerable<LoanResponseDto>>> GetMyLoans()
    {
        var sid = User.FindFirst("sid")?.Value;
        if (sid == null)
        {
            _logger.LogWarning("Unauthorized access attempt to GetMyLoans: SID claim missing.");
            return Unauthorized();
        }

        if (!Guid.TryParse(sid, out var userId))
        {
            _logger.LogWarning("Invalid user ID format in token: {SID}", sid);
            return BadRequest("Invalid user ID in token.");
        }

        var loans = await _getLoansHandler.Handle(new(userId));
        return Ok(loans);
    }
}
