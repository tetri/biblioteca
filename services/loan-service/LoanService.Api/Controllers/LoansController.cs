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

    public LoansController(ICommandHandler<CreateLoanCommand, Shared.Contracts.Result<LoanResponseDto>> createLoanHandler)
    {
        _createLoanHandler = createLoanHandler;
    }

    [HttpPost]
    public async Task<ActionResult<LoanResponseDto>> Create([FromBody] CreateLoanCommand command)
    {
        var result = await _createLoanHandler.Handle(command);
        
        if (result.IsFailure)
        {
            return BadRequest(result.Error);
        }

        return CreatedAtAction(nameof(Get), new { id = result.Value!.Id }, result.Value);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<LoanResponseDto>> Get(Guid id)
    {
        // Para consultas, implementaremos o padrão de Query posteriormente.
        // Por ora, mantemos a leitura direta ou simplificada.
        return Ok("Implementar QueryHandler em breve.");
    }
}
