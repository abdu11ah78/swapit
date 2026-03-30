using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Disputes.Commands.CreateDispute;
using SwapIt.Application.Features.Disputes.Commands.UpdateDispute;
using SwapIt.Application.Features.Disputes.Dtos;

namespace SwapIt.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class DisputesController(IMediator mediator, ICurrentUserService currentUserService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDisputeRequestDto request, CancellationToken cancellationToken)
    {
        var command = new CreateDisputeCommand(currentUserService.UserId, request.TradeId, request.Reason, request.Evidence);
        var result = await mediator.Send(command, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpPatch]
    public async Task<IActionResult> Update([FromBody] UpdateDisputeRequestDto request, CancellationToken cancellationToken)
    {
        var command = new UpdateDisputeCommand(currentUserService.UserId, request.DisputeId, request.Status, request.Resolution);
        var result = await mediator.Send(command, cancellationToken);
        return Ok(result);
    }
}
