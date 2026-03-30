using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Notifications.Dtos;

namespace SwapIt.Application.Features.Notifications.Queries.GetMyNotifications;

public sealed record GetMyNotificationsQuery(string UserId) : IRequest<GetMyNotificationsResponseDto>;

public sealed class GetMyNotificationsResponseDto
{
    public IReadOnlyList<NotificationResponseDto> Notifications { get; init; } = [];
}

public sealed class GetMyNotificationsQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetMyNotificationsQuery, GetMyNotificationsResponseDto>
{
    public async Task<GetMyNotificationsResponseDto> Handle(GetMyNotificationsQuery request, CancellationToken cancellationToken)
    {
        var notifications = await dbContext.Notifications
            .AsNoTracking()
            .Where(n => n.UserId == request.UserId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(100)
            .ToListAsync(cancellationToken);

        return new GetMyNotificationsResponseDto
        {
            Notifications = notifications.Select(n => n.Adapt<NotificationResponseDto>()).ToList()
        };
    }
}
