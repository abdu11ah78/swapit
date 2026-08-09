using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwapIt.Application.Features.Messages.Commands.SendMessage;
using SwapIt.Application.Features.Messages.Queries.GetChatMessages;
using SwapIt.Application.Features.Messages.Queries.GetConversations;
using SwapIt.Application.Features.Messages.Queries.GetUserConversation;

namespace SwapIt.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class MessagesController(IMediator mediator) : ControllerBase
{
    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations(CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetConversationsQuery(), cancellationToken);
        return Ok(new { conversations = result });
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserConversation(string userId, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetUserConversationQuery(userId), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetChatMessages(string userId, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetChatMessagesQuery(userId), cancellationToken);
        return Ok(new { messages = result });
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request, CancellationToken cancellationToken)
    {
        var command = new SendMessageCommand(request.ReceiverId, request.Content);
        var result = await mediator.Send(command, cancellationToken);
        return Ok(result);
    }
}

public class SendMessageRequest
{
    public string ReceiverId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}
