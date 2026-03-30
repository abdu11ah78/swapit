using Mapster;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Offers.Commands.CreateOffer;
using SwapIt.Application.Features.Offers.Commands.DecideOffer;
using SwapIt.Application.Features.Offers.Dtos;
using SwapIt.Application.Features.Offers.Queries.GetMyOffers;

namespace SwapIt.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class OffersController(IMediator mediator, ICurrentUserService currentUserService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyOffers(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetMyOffersQuery(currentUserService.UserId), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOfferRequestDto request, CancellationToken cancellationToken)
    {
        var command = request.Adapt<CreateOfferCommand>();
        var result = await mediator.Send(command, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpPatch]
    public async Task<IActionResult> Decide([FromBody] OfferDecisionRequestDto request, CancellationToken cancellationToken)
    {
        var command = request.Adapt<DecideOfferCommand>();
        var result = await mediator.Send(command, cancellationToken);
        return Ok(result);
    }
}
