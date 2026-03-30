using MediatR;
using Microsoft.EntityFrameworkCore;
using Mapster;
using SwapIt.Application.Common.Exceptions;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Offers.Dtos;
using SwapIt.Core.Enums;

namespace SwapIt.Application.Features.Offers.Commands.DecideOffer;

public sealed record DecideOfferCommand(string OfferId, string Action) : IRequest<OfferResponseDto>;

public sealed class DecideOfferCommandHandler(
    IApplicationDbContext dbContext,
    ICurrentUserService currentUser) : IRequestHandler<DecideOfferCommand, OfferResponseDto>
{
    public async Task<OfferResponseDto> Handle(DecideOfferCommand request, CancellationToken cancellationToken)
    {
        var offer = await dbContext.Offers
            .Include(x => x.Trade)
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x => x.Id == request.OfferId, cancellationToken);

        if (offer is null)
        {
            throw new AppException("Offer not found", 404);
        }

        var isParticipant = currentUser.UserId == offer.Trade.BuyerId || currentUser.UserId == offer.Trade.SellerId;
        if (!isParticipant)
        {
            throw new AppException("Forbidden", 403);
        }

        if (offer.ExpiresAt.HasValue && offer.ExpiresAt.Value <= DateTime.UtcNow)
        {
            offer.Status = OfferStatus.Expired;
            await dbContext.SaveChangesAsync(cancellationToken);
            throw new AppException("Offer expired", 400);
        }

        var nextStatus = request.Action switch
        {
            "ACCEPT" => OfferStatus.Accepted,
            "REJECT" => OfferStatus.Rejected,
            _ => OfferStatus.Countered
        };

        offer.Status = nextStatus;

        var recipientId = currentUser.UserId == offer.Trade.BuyerId ? offer.Trade.SellerId : offer.Trade.BuyerId;
        var notificationType = nextStatus switch
        {
            OfferStatus.Accepted => NotificationType.OfferAccepted,
            OfferStatus.Rejected => NotificationType.OfferRejected,
            _ => NotificationType.OfferUpdated
        };

        dbContext.Notifications.Add(new Core.Entities.Notification(
            Guid.NewGuid().ToString("N"),
            notificationType,
            $"Your offer was {nextStatus.ToString().ToLowerInvariant()}.",
            recipientId));

        await dbContext.SaveChangesAsync(cancellationToken);

        return offer.Adapt<OfferResponseDto>();
    }
}
