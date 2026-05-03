using MediatR;
using Microsoft.EntityFrameworkCore;
using Mapster;
using SwapIt.Application.Common.Exceptions;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Messages.Dtos;
using SwapIt.Core.Entities;

namespace SwapIt.Application.Features.Messages.Commands.SendMessage;

public sealed record SendMessageCommand(string ReceiverId, string Content) : IRequest<MessageDto>;

public sealed class SendMessageCommandHandler(
    IApplicationDbContext dbContext,
    ICurrentUserService currentUser) : IRequestHandler<SendMessageCommand, MessageDto>
{
    public async Task<MessageDto> Handle(SendMessageCommand request, CancellationToken cancellationToken)
    {
        if (currentUser.UserId == request.ReceiverId)
        {
            throw new AppException("Cannot send message to yourself", 400);
        }

        var receiver = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == request.ReceiverId, cancellationToken);
        if (receiver is null)
        {
            throw new AppException("Receiver not found", 404);
        }

        var message = new Message(Guid.NewGuid().ToString("N"), currentUser.UserId, request.ReceiverId, request.Content);
        
        dbContext.Messages.Add(message);
        await dbContext.SaveChangesAsync(cancellationToken);

        var dto = message.Adapt<MessageDto>();
        dto.IsMine = true;
        return dto;
    }
}
