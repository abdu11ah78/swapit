using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Exceptions;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Messages.Dtos;

namespace SwapIt.Application.Features.Messages.Queries.GetUserConversation;

public sealed record GetUserConversationQuery(string OtherUserId) : IRequest<ConversationDto>;

public class GetUserConversationQueryHandler(
    IApplicationDbContext dbContext,
    ICurrentUserService currentUser) : IRequestHandler<GetUserConversationQuery, ConversationDto>
{
    public async Task<ConversationDto> Handle(GetUserConversationQuery request, CancellationToken cancellationToken)
    {
        var uid = currentUser.UserId;
        var otherUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == request.OtherUserId, cancellationToken);
        if (otherUser == null)
        {
            throw new AppException("User not found", 404);
        }

        // Get the last message between these two users if any
        var lastMessage = await dbContext.Messages
            .AsNoTracking()
            .Where(m => (m.SenderId == uid && m.ReceiverId == request.OtherUserId) ||
                        (m.ReceiverId == uid && m.SenderId == request.OtherUserId))
            .OrderByDescending(m => m.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);

        // Check if it is a request: other user sent message, current user never replied
        var messages = await dbContext.Messages
            .AsNoTracking()
            .Where(m => (m.SenderId == uid && m.ReceiverId == request.OtherUserId) ||
                        (m.ReceiverId == uid && m.SenderId == request.OtherUserId))
            .ToListAsync(cancellationToken);

        var otherUserSentFirst = messages.Any(m => m.SenderId == request.OtherUserId);
        var currentUserReplied = messages.Any(m => m.SenderId == uid);
        var isRequest = otherUserSentFirst && !currentUserReplied;

        return new ConversationDto
        {
            UserId = otherUser.Id,
            UserName = otherUser.Name ?? "Unknown",
            UserImage = otherUser.Image,
            UserPhoneNumber = otherUser.PhoneNumber,
            UserTrustScore = otherUser.TrustScore,
            LastMessage = lastMessage?.Content ?? string.Empty,
            LastMessageAt = lastMessage?.CreatedAt ?? DateTime.UtcNow,
            IsOnline = true,
            IsRequest = isRequest
        };
    }
}
