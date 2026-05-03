using MediatR;
using Microsoft.EntityFrameworkCore;
using Mapster;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Messages.Dtos;
using SwapIt.Core.Entities;

namespace SwapIt.Application.Features.Messages.Queries.GetChatMessages;

public sealed record GetChatMessagesQuery(string OtherUserId) : IRequest<List<MessageDto>>;

public sealed class GetChatMessagesQueryHandler(
    IApplicationDbContext dbContext,
    ICurrentUserService currentUser) : IRequestHandler<GetChatMessagesQuery, List<MessageDto>>
{
    public async Task<List<MessageDto>> Handle(GetChatMessagesQuery request, CancellationToken cancellationToken)
    {
        var uid = currentUser.UserId;

        var messages = await dbContext.Messages
            .AsNoTracking()
            .Where(m =>
                (m.SenderId == uid && m.ReceiverId == request.OtherUserId) ||
                (m.ReceiverId == uid && m.SenderId == request.OtherUserId))
            .OrderBy(m => m.CreatedAt)
            .ToListAsync(cancellationToken);

        // Mark unread messages as read
        var unreadIds = messages
            .Where(m => m.ReceiverId == uid && !m.IsRead)
            .Select(m => m.Id)
            .ToList();

        if (unreadIds.Count > 0)
        {
            var dbUnread = await dbContext.Messages
                .Where(m => unreadIds.Contains(m.Id))
                .ToListAsync(cancellationToken);

            foreach (var msg in dbUnread)
            {
                msg.IsRead = true;
            }
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return messages.Select(m =>
        {
            var dto = m.Adapt<MessageDto>();
            dto.IsMine = m.SenderId == uid;
            return dto;
        }).ToList();
    }
}
