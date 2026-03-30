using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Reviews.Commands.SubmitReview;
using SwapIt.Application.Features.Reviews.Dtos;

namespace SwapIt.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class ReviewsController(IMediator mediator, ICurrentUserService currentUserService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] SubmitReviewRequestDto request, CancellationToken cancellationToken)
    {
        var command = new SubmitReviewCommand(
            currentUserService.UserId,
            request.TradeId,
            request.TargetId,
            request.Rating,
            request.Comment);

        var result = await mediator.Send(command, cancellationToken);
        return Ok(result);
    }
}
