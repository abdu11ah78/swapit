using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Exceptions;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Disputes.Dtos;
using SwapIt.Core.Enums;

namespace SwapIt.Application.Features.Disputes.Commands.UpdateDispute;

public sealed record UpdateDisputeCommand(string UserId, string DisputeId, string Status, string? Resolution) : IRequest<DisputeResponseDto>;

public sealed class UpdateDisputeCommandHandler(IApplicationDbContext dbContext) : IRequestHandler<UpdateDisputeCommand, DisputeResponseDto>
{
    public async Task<DisputeResponseDto> Handle(UpdateDisputeCommand request, CancellationToken cancellationToken)
    {
        var actor = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
        if (actor?.Role != UserRole.Admin)
        {
            throw new AppException("Admin only endpoint", 403);
        }

        var dispute = await dbContext.Disputes.FirstOrDefaultAsync(d => d.Id == request.DisputeId, cancellationToken);
        if (dispute is null)
        {
            throw new AppException("Dispute not found", 404);
        }

        dispute.Status = Enum.Parse<DisputeStatus>(request.Status, true);
        dispute.Resolution = request.Resolution;
        dispute.ReviewerId = request.UserId;

        // Auto-unban if resolving an account reopening request
        if (dispute.Status == DisputeStatus.Resolved && 
            dispute.Reason.StartsWith("Account Reopening:") && 
            dispute.ReportedUserId != null)
        {
            var bannedUser = await dbContext.Users.FindAsync([dispute.ReportedUserId], cancellationToken);
            if (bannedUser != null)
            {
                bannedUser.IsBanned = false;
            }
        }

        dbContext.Notifications.Add(new Core.Entities.Notification(
            Guid.NewGuid().ToString("N"),
            NotificationType.DisputeUpdate,
            $"Dispute moved to {request.Status.ToUpperInvariant()}.",
            dispute.ReporterId));

        await dbContext.SaveChangesAsync(cancellationToken);
        return dispute.Adapt<DisputeResponseDto>();
    }
}
