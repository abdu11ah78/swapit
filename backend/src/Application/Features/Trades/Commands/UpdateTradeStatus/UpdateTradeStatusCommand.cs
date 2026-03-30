using MediatR;
using Microsoft.EntityFrameworkCore;
using Mapster;
using SwapIt.Application.Common.Exceptions;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Common.Rules;
using SwapIt.Application.Features.Trades.Dtos;
using SwapIt.Core.Entities;
using SwapIt.Core.Enums;

namespace SwapIt.Application.Features.Trades.Commands.UpdateTradeStatus;

public sealed record UpdateTradeStatusCommand(string TradeId, string Status, string? Note) : IRequest<TradeResponseDto>;

public sealed class UpdateTradeStatusCommandHandler(
    IApplicationDbContext dbContext,
    ICurrentUserService currentUser) : IRequestHandler<UpdateTradeStatusCommand, TradeResponseDto>
{
    public async Task<TradeResponseDto> Handle(UpdateTradeStatusCommand request, CancellationToken cancellationToken)
    {
        var trade = await dbContext.Trades
            .Include(x => x.Lifecycle)
            .FirstOrDefaultAsync(x => x.Id == request.TradeId, cancellationToken);
        if (trade is null)
        {
            throw new AppException("Trade not found", 404);
        }

        if (trade.BuyerId != currentUser.UserId && trade.SellerId != currentUser.UserId)
        {
            throw new AppException("Forbidden", 403);
        }

        if (!Enum.TryParse<TradeStatus>(request.Status, true, out var nextStatus))
        {
            throw new AppException("Invalid status transition", 400);
        }

        if (!TradeStatusRules.CanTransition(trade.Status, nextStatus))
        {
            throw new AppException("Invalid status transition", 400);
        }

        var previousStatus = trade.Status;
        trade.Status = nextStatus;
        trade.EscrowHold = nextStatus is TradeStatus.Accepted or TradeStatus.InProgress;
        trade.CompletedAt = nextStatus == TradeStatus.Completed ? DateTime.UtcNow : null;

        var lifecycleEvent = new TradeEvent(Guid.NewGuid().ToString("N"), trade.Id, nextStatus)
        {
            FromStatus = previousStatus,
            ActorId = currentUser.UserId,
            Note = request.Note
        };
        dbContext.TradeEvents.Add(lifecycleEvent);

        if (nextStatus == TradeStatus.Completed)
        {
            var item = await dbContext.Items.FirstOrDefaultAsync(x => x.Id == trade.ItemId, cancellationToken);
            if (item is not null)
            {
                item.Status = ItemStatus.Swapped;
            }
        }

        var recipientId = currentUser.UserId == trade.BuyerId ? trade.SellerId : trade.BuyerId;
        dbContext.Notifications.Add(new Notification(
            Guid.NewGuid().ToString("N"),
            NotificationType.TradeUpdate,
            $"Trade moved to {nextStatus.ToString().ToUpperInvariant()}",
            recipientId));

        await dbContext.SaveChangesAsync(cancellationToken);

        var lifecycle = trade.Lifecycle
            .Append(lifecycleEvent)
            .OrderBy(x => x.CreatedAt)
            .Select(x => new TradeEventDto
            {
                Id = x.Id,
                FromStatus = x.FromStatus?.ToString().ToUpperInvariant(),
                ToStatus = x.ToStatus.ToString().ToUpperInvariant(),
                ActorId = x.ActorId,
                Note = x.Note,
                CreatedAt = x.CreatedAt
            })
            .ToList();

        var dto = trade.Adapt<TradeResponseDto>();
        return new TradeResponseDto
        {
            Id = dto.Id,
            BuyerId = dto.BuyerId,
            SellerId = dto.SellerId,
            ItemId = dto.ItemId,
            Status = dto.Status,
            EscrowHold = dto.EscrowHold,
            CompletedAt = dto.CompletedAt,
            CreatedAt = dto.CreatedAt,
            UpdatedAt = dto.UpdatedAt,
            Lifecycle = lifecycle
        };
    }
}
