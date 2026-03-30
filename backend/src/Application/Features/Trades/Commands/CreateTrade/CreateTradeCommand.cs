using MediatR;
using Microsoft.EntityFrameworkCore;
using Mapster;
using SwapIt.Application.Common.Exceptions;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Trades.Dtos;
using SwapIt.Core.Entities;
using SwapIt.Core.Enums;

namespace SwapIt.Application.Features.Trades.Commands.CreateTrade;

public sealed record CreateTradeCommand(string ItemId, string SellerId) : IRequest<TradeResponseDto>;

public sealed class CreateTradeCommandHandler(
    IApplicationDbContext dbContext,
    ICurrentUserService currentUser) : IRequestHandler<CreateTradeCommand, TradeResponseDto>
{
    public async Task<TradeResponseDto> Handle(CreateTradeCommand request, CancellationToken cancellationToken)
    {
        var item = await dbContext.Items.FirstOrDefaultAsync(i => i.Id == request.ItemId, cancellationToken);
        if (item is null)
        {
            throw new AppException("Item not found", 404);
        }

        var trade = new Trade(Guid.NewGuid().ToString("N"), currentUser.UserId, request.SellerId, request.ItemId)
        {
            Status = TradeStatus.Pending
        };

        dbContext.Trades.Add(trade);

        var initialEvent = new TradeEvent(Guid.NewGuid().ToString("N"), trade.Id, TradeStatus.Pending)
        {
            ActorId = currentUser.UserId,
            Note = "Trade created"
        };
        dbContext.TradeEvents.Add(initialEvent);

        dbContext.Notifications.Add(new Notification(
            Guid.NewGuid().ToString("N"),
            NotificationType.OfferReceived,
            "A new trade request was created for your item.",
            request.SellerId));

        await dbContext.SaveChangesAsync(cancellationToken);

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
            Lifecycle = [new TradeEventDto
            {
                Id = initialEvent.Id,
                FromStatus = null,
                ToStatus = initialEvent.ToStatus.ToString().ToUpperInvariant(),
                ActorId = initialEvent.ActorId,
                Note = initialEvent.Note,
                CreatedAt = initialEvent.CreatedAt
            }]
        };
    }
}
