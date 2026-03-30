using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Notifications.Commands.CreateNotification;
using SwapIt.Application.Features.Notifications.Commands.MarkNotificationRead;
using SwapIt.Application.Features.Notifications.Dtos;
using SwapIt.Application.Features.Notifications.Queries.GetMyNotifications;

namespace SwapIt.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class NotificationsController(IMediator mediator, ICurrentUserService currentUserService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetMyNotificationsQuery(currentUserService.UserId), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateNotificationRequestDto request, CancellationToken cancellationToken)
    {
        var command = new CreateNotificationCommand(currentUserService.UserId, request.UserId, request.Type, request.Message);
        var result = await mediator.Send(command, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpPatch]
    public async Task<IActionResult> MarkRead([FromBody] MarkNotificationReadRequestDto request, CancellationToken cancellationToken)
    {
        var command = new MarkNotificationReadCommand(currentUserService.UserId, request.Id);
        var result = await mediator.Send(command, cancellationToken);
        return Ok(result);
    }
}
