using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Offers.Dtos;

namespace SwapIt.Application.Features.Offers.Queries.GetMyOffers;

public sealed record GetMyOffersQuery(string UserId) : IRequest<GetMyOffersResponseDto>;

public sealed class GetMyOffersResponseDto
{
    public IReadOnlyList<OfferResponseDto> Offers { get; init; } = [];
}

public sealed class GetMyOffersQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetMyOffersQuery, GetMyOffersResponseDto>
{
    public async Task<GetMyOffersResponseDto> Handle(GetMyOffersQuery request, CancellationToken cancellationToken)
    {
        var offers = await dbContext.Offers
            .AsNoTracking()
            .Include(x => x.Items)
            .Include(x => x.Trade)
            .Where(x =>
                x.MakerId == request.UserId ||
                x.Trade.BuyerId == request.UserId ||
                x.Trade.SellerId == request.UserId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);

        return new GetMyOffersResponseDto
        {
            Offers = offers.Select(x => x.Adapt<OfferResponseDto>()).ToList()
        };
    }
}
