using MediatR;
using Microsoft.EntityFrameworkCore;
using Mapster;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Trades.Dtos;

namespace SwapIt.Application.Features.Trades.Queries.GetMyTrades;

public sealed record GetMyTradesQuery() : IRequest<GetMyTradesResponseDto>;

public sealed class GetMyTradesResponseDto
{
    public IReadOnlyList<TradeResponseDto> Trades { get; init; } = [];
}

public sealed class GetMyTradesQueryHandler(
    IApplicationDbContext dbContext,
    ICurrentUserService currentUser) : IRequestHandler<GetMyTradesQuery, GetMyTradesResponseDto>
{
    public async Task<GetMyTradesResponseDto> Handle(GetMyTradesQuery request, CancellationToken cancellationToken)
    {
        var trades = await dbContext.Trades
            .AsNoTracking()
            .Include(x => x.Lifecycle)
            .Where(x => x.BuyerId == currentUser.UserId || x.SellerId == currentUser.UserId)
            .OrderByDescending(x => x.UpdatedAt)
            .ToListAsync(cancellationToken);

        var result = trades.Select(trade =>
        {
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
                Lifecycle = trade.Lifecycle
                    .OrderBy(x => x.CreatedAt)
                    .Select(x => x.Adapt<TradeEventDto>())
                    .ToList()
            };
        }).ToList();

        return new GetMyTradesResponseDto { Trades = result };
    }
}
