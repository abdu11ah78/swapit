using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Exceptions;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Notifications.Dtos;

namespace SwapIt.Application.Features.Notifications.Commands.MarkNotificationRead;

public sealed record MarkNotificationReadCommand(string UserId, string Id) : IRequest<NotificationResponseDto>;

public sealed class MarkNotificationReadCommandHandler(IApplicationDbContext dbContext)
    : IRequestHandler<MarkNotificationReadCommand, NotificationResponseDto>
{
    public async Task<NotificationResponseDto> Handle(MarkNotificationReadCommand request, CancellationToken cancellationToken)
    {
        var notification = await dbContext.Notifications.FirstOrDefaultAsync(n => n.Id == request.Id, cancellationToken);
        if (notification is null || notification.UserId != request.UserId)
        {
            throw new AppException("Notification not found", 404);
        }

        notification.Read = true;
        await dbContext.SaveChangesAsync(cancellationToken);
        return notification.Adapt<NotificationResponseDto>();
    }
}
