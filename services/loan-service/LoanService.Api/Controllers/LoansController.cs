using LoanService.Application.Abstractions;
using LoanService.Application.Commands;
using LoanService.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LoanService.Domain.Repositories;

namespace LoanService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoansController : ControllerBase
{
    private readonly ICommandHandler<CreateLoanCommand, Shared.Contracts.Result<LoanResponseDto>> _createLoanHandler;
    private readonly ICommandHandler<ReserveLoanCommand, Shared.Contracts.Result<LoanResponseDto>> _reserveHandler;
    private readonly IQueryHandler<LoanService.Application.Queries.GetLoansByUserIdQuery, IEnumerable<LoanResponseDto>> _getLoansHandler;
    private readonly ILoanRepository _loanRepository;
    private readonly ILogger<LoansController> _logger;

    public LoansController(
        ICommandHandler<CreateLoanCommand, Shared.Contracts.Result<LoanResponseDto>> createLoanHandler,
        ICommandHandler<ReserveLoanCommand, Shared.Contracts.Result<LoanResponseDto>> reserveHandler,
        IQueryHandler<LoanService.Application.Queries.GetLoansByUserIdQuery, IEnumerable<LoanResponseDto>> getLoansHandler,
        ILoanRepository loanRepository,
        ILogger<LoansController> logger)
    {
        _createLoanHandler = createLoanHandler;
        _reserveHandler = reserveHandler;
        _getLoansHandler = getLoansHandler;
        _loanRepository = loanRepository;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<LoanResponseDto>> Create([FromBody] CreateLoanCommand command, CancellationToken cancellationToken)
    {
        var result = await _createLoanHandler.Handle(command, cancellationToken);

        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPost("reserve")]
    public async Task<ActionResult<LoanResponseDto>> Reserve([FromBody] ReserveLoanCommand command, CancellationToken cancellationToken)
    {
        var result = await _reserveHandler.Handle(command, cancellationToken);
        
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [Authorize]
    [HttpGet("my-loans")]
    public async Task<ActionResult<IEnumerable<LoanResponseDto>>> GetMyLoans(CancellationToken cancellationToken)
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

        var loans = await _getLoansHandler.Handle(new(userId), cancellationToken);
        return Ok(loans);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<LoanResponseDto>>> GetAllLoansForAdmin(CancellationToken cancellationToken)
    {
        var allLoans = await _loanRepository.GetAllAsync(cancellationToken);
        var response = allLoans.Select(l => new LoanResponseDto(
            l.Id,
            l.UserId,
            l.BookId,
            l.LoanDate,
            l.DueDate,
            l.Status.ToString()));

        return Ok(response);
    }
}
