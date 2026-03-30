using Mapster;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwapIt.Application.Features.Trades.Commands.CreateTrade;
using SwapIt.Application.Features.Trades.Commands.UpdateTradeStatus;
using SwapIt.Application.Features.Trades.Dtos;
using SwapIt.Application.Features.Trades.Queries.GetMyTrades;

namespace SwapIt.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class TradesController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTradeRequestDto request, CancellationToken cancellationToken)
    {
        var command = request.Adapt<CreateTradeCommand>();
        var result = await mediator.Send(command, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyTrades(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetMyTradesQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(
        [FromRoute] string id,
        [FromBody] UpdateTradeStatusRequestDto request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateTradeStatusCommand(id, request.Status, request.Note);
        var result = await mediator.Send(command, cancellationToken);
        return Ok(result);
    }
}
