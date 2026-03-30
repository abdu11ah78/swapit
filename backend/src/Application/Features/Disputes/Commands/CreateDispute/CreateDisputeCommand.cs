using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Exceptions;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Disputes.Dtos;
using SwapIt.Core.Entities;
using SwapIt.Core.Enums;

namespace SwapIt.Application.Features.Disputes.Commands.CreateDispute;

public sealed record CreateDisputeCommand(string UserId, string TradeId, string Reason, string? Evidence) : IRequest<DisputeResponseDto>;

public sealed class CreateDisputeCommandHandler(IApplicationDbContext dbContext) : IRequestHandler<CreateDisputeCommand, DisputeResponseDto>
{
    public async Task<DisputeResponseDto> Handle(CreateDisputeCommand request, CancellationToken cancellationToken)
    {
        var trade = await dbContext.Trades.FirstOrDefaultAsync(t => t.Id == request.TradeId, cancellationToken);
        if (trade is null)
        {
            throw new AppException("Trade not found", 404);
        }

        if (request.UserId != trade.BuyerId && request.UserId != trade.SellerId)
        {
            throw new AppException("Forbidden", 403);
        }

        var dispute = new Dispute(Guid.NewGuid().ToString("N"), request.Reason, request.TradeId, request.UserId)
        {
            Evidence = request.Evidence
        };
        dbContext.Disputes.Add(dispute);
        trade.Status = TradeStatus.Disputed;

        var recipientId = request.UserId == trade.BuyerId ? trade.SellerId : trade.BuyerId;
        dbContext.Notifications.Add(new Notification(
            Guid.NewGuid().ToString("N"),
            NotificationType.DisputeUpdate,
            "A dispute has been raised on your trade.",
            recipientId));

        await dbContext.SaveChangesAsync(cancellationToken);
        return dispute.Adapt<DisputeResponseDto>();
    }
}
