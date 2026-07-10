using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Messages.Dtos;

namespace SwapIt.Application.Features.Messages.Queries.GetConversations;

public sealed record GetConversationsQuery() : IRequest<List<ConversationDto>>;

public sealed class GetConversationsQueryHandler(
    IApplicationDbContext dbContext,
    ICurrentUserService currentUser) : IRequestHandler<GetConversationsQuery, List<ConversationDto>>
{
    public async Task<List<ConversationDto>> Handle(GetConversationsQuery request, CancellationToken cancellationToken)
    {
        var uid = currentUser.UserId;

        var messages = await dbContext.Messages
            .AsNoTracking()
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Where(m => m.SenderId == uid || m.ReceiverId == uid)
            .ToListAsync(cancellationToken);

        var conversations = messages
            .GroupBy(m => m.SenderId == uid ? m.ReceiverId : m.SenderId)
            .Select(g =>
            {
                var lastMessage = g.OrderByDescending(m => m.CreatedAt).First();
                var otherUser = lastMessage.SenderId == uid ? lastMessage.Receiver : lastMessage.Sender;

                // Determine if this is a "message request": other user has sent at least one message,
                // but the current user has never replied.
                var otherUserSentFirst = g.Any(m => m.SenderId == otherUser.Id);
                var currentUserReplied = g.Any(m => m.SenderId == uid);
                var isRequest = otherUserSentFirst && !currentUserReplied;

                return new ConversationDto
                {
                    UserId = otherUser.Id,
                    UserName = otherUser.Name ?? "Unknown",
                    UserImage = otherUser.Image,
                    UserPhoneNumber = otherUser.PhoneNumber,
                    UserTrustScore = otherUser.TrustScore,
                    LastMessage = lastMessage.Content,
                    LastMessageAt = lastMessage.CreatedAt,
                    IsOnline = true,
                    IsRequest = isRequest
                };
            })
            .OrderByDescending(c => c.LastMessageAt)
            .ToList();

        return conversations;
    }
}
