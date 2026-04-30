using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Admin;

public sealed class TradeAdminDto
{
    public string Id { get; init; } = string.Empty;
    public string MainItemTitle { get; init; } = string.Empty;
    public string BuyerName { get; init; } = string.Empty;
    public string SellerName { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public bool EscrowHold { get; init; }
    public DateTime CreatedAt { get; init; }
}

public sealed record GetTradesQuery : IRequest<List<TradeAdminDto>>;

public sealed class GetTradesQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetTradesQuery, List<TradeAdminDto>>
{
    public async Task<List<TradeAdminDto>> Handle(GetTradesQuery request, CancellationToken cancellationToken)
    {
        return await dbContext.Trades
            .Select(t => new TradeAdminDto
            {
                Id = t.Id,
                MainItemTitle = t.MainItem.Title,
                BuyerName = t.Buyer.Name ?? t.Buyer.Email,
                SellerName = t.Seller.Name ?? t.Seller.Email,
                Status = t.Status.ToString(),
                EscrowHold = t.EscrowHold,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
