using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Admin;

public sealed class OfferAdminDto
{
    public string Id { get; init; } = string.Empty;
    public string TradeId { get; init; } = string.Empty;
    public string MakerName { get; init; } = string.Empty;
    public int OfferedLtp { get; init; }
    public string Status { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}

public sealed record GetOffersQuery : IRequest<List<OfferAdminDto>>;

public sealed class GetOffersQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetOffersQuery, List<OfferAdminDto>>
{
    public async Task<List<OfferAdminDto>> Handle(GetOffersQuery request, CancellationToken cancellationToken)
    {
        return await dbContext.Offers
            .Select(o => new OfferAdminDto
            {
                Id = o.Id,
                TradeId = o.TradeId,
                MakerName = o.Maker.Name ?? o.Maker.Email,
                OfferedLtp = o.OfferedLtp,
                Status = o.Status.ToString(),
                CreatedAt = o.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
