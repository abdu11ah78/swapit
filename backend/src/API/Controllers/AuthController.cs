using Mapster;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SwapIt.Application.Features.Auth.Commands.Login;
using SwapIt.Application.Features.Auth.Commands.Register;
using SwapIt.Application.Features.Auth.Commands.RequestReopen;
using SwapIt.Application.Features.Auth.Dtos;

namespace SwapIt.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController(IMediator mediator) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request, CancellationToken cancellationToken)
    {
        var command = request.Adapt<RegisterCommand>();
        var result = await mediator.Send(command, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request, CancellationToken cancellationToken)
    {
        var command = request.Adapt<LoginCommand>();
        var result = await mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpPost("request-reopen")]
    public async Task<IActionResult> RequestReopen([FromBody] RequestReopenRequestDto request, CancellationToken cancellationToken)
    {
        var command = new RequestReopenCommand(request.Email, request.Reason);
        await mediator.Send(command, cancellationToken);
        return Ok(new { message = "Reopening request submitted successfully." });
    }
}

public class RequestReopenRequestDto
{
    public string Email { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
}
