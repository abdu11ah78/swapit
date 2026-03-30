using MediatR;
using Microsoft.EntityFrameworkCore;
using Mapster;
using SwapIt.Application.Common.Exceptions;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Offers.Dtos;
using SwapIt.Core.Entities;
using SwapIt.Core.Enums;

namespace SwapIt.Application.Features.Offers.Commands.CreateOffer;

public sealed record CreateOfferCommand(
    string TradeId,
    int OfferedLtp,
    string? OfferedItemId,
    string[] OfferedItemIds,
    string? Message,
    DateTime? ExpiresAt,
    string? ParentOfferId) : IRequest<OfferResponseDto>;

public sealed class CreateOfferCommandHandler(
    IApplicationDbContext dbContext,
    ICurrentUserService currentUser) : IRequestHandler<CreateOfferCommand, OfferResponseDto>
{
    public async Task<OfferResponseDto> Handle(CreateOfferCommand request, CancellationToken cancellationToken)
    {
        var trade = await dbContext.Trades.FirstOrDefaultAsync(x => x.Id == request.TradeId, cancellationToken);
        if (trade is null)
        {
            throw new AppException("Trade not found", 404);
        }

        if (currentUser.UserId != trade.BuyerId && currentUser.UserId != trade.SellerId)
        {
            throw new AppException("Forbidden", 403);
        }

        var negotiable = trade.Status is TradeStatus.Pending or TradeStatus.Accepted or TradeStatus.InProgress;
        if (!negotiable)
        {
            throw new AppException("Trade is not negotiable", 400);
        }

        if (request.ExpiresAt.HasValue && request.ExpiresAt.Value <= DateTime.UtcNow)
        {
            throw new AppException("Expiration must be in future", 400);
        }

        var id = Guid.NewGuid().ToString("N");
        var distinctItemIds = request.OfferedItemIds
            .Append(request.OfferedItemId ?? string.Empty)
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Distinct()
            .ToList();

        var offer = new Offer(id, request.TradeId, currentUser.UserId)
        {
            OfferedLtp = request.OfferedLtp,
            OfferedItemId = string.IsNullOrWhiteSpace(request.OfferedItemId) ? null : request.OfferedItemId,
            Message = request.Message,
            ExpiresAt = request.ExpiresAt,
            ParentOfferId = string.IsNullOrWhiteSpace(request.ParentOfferId) ? null : request.ParentOfferId,
            Status = string.IsNullOrWhiteSpace(request.ParentOfferId) ? OfferStatus.Open : OfferStatus.Countered
        };

        dbContext.Offers.Add(offer);

        foreach (var itemId in distinctItemIds)
        {
            dbContext.OfferItems.Add(new OfferItem(Guid.NewGuid().ToString("N"), id, itemId));
        }

        var recipientId = currentUser.UserId == trade.BuyerId ? trade.SellerId : trade.BuyerId;
        dbContext.Notifications.Add(new Notification(
            Guid.NewGuid().ToString("N"),
            NotificationType.OfferReceived,
            "You have received a new offer.",
            recipientId));

        await dbContext.SaveChangesAsync(cancellationToken);

        var dto = offer.Adapt<OfferResponseDto>();
        return new OfferResponseDto
        {
            Id = dto.Id,
            TradeId = dto.TradeId,
            MakerId = dto.MakerId,
            OfferedLtp = dto.OfferedLtp,
            Message = dto.Message,
            Status = dto.Status,
            ExpiresAt = dto.ExpiresAt,
            OfferedItemId = dto.OfferedItemId,
            ParentOfferId = dto.ParentOfferId,
            ItemIds = distinctItemIds,
            CreatedAt = dto.CreatedAt
        };
    }
}
