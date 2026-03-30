using Mapster;
using MediatR;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Notifications.Dtos;
using SwapIt.Core.Entities;
using SwapIt.Core.Enums;

namespace SwapIt.Application.Features.Notifications.Commands.CreateNotification;

public sealed record CreateNotificationCommand(string ActorUserId, string UserId, string Type, string Message) : IRequest<NotificationResponseDto>;

public sealed class CreateNotificationCommandHandler(IApplicationDbContext dbContext)
    : IRequestHandler<CreateNotificationCommand, NotificationResponseDto>
{
    public async Task<NotificationResponseDto> Handle(CreateNotificationCommand request, CancellationToken cancellationToken)
    {
        var notification = new Notification(
            Guid.NewGuid().ToString("N"),
            Enum.Parse<NotificationType>(request.Type, true),
            request.Message,
            request.UserId);

        dbContext.Notifications.Add(notification);
        await dbContext.SaveChangesAsync(cancellationToken);
        return notification.Adapt<NotificationResponseDto>();
    }
}
