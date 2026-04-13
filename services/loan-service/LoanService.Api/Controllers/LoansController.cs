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

    public LoansController(
        ICommandHandler<CreateLoanCommand, Shared.Contracts.Result<LoanResponseDto>> createLoanHandler,
        ICommandHandler<ReserveLoanCommand, Shared.Contracts.Result<LoanResponseDto>> reserveHandler)
    {
        _createLoanHandler = createLoanHandler;
        _reserveHandler = reserveHandler;
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
}
