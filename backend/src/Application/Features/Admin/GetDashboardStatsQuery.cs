using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Admin;

public sealed class DashboardStatsDto
{
    public int TotalUsers { get; init; }
    public int TotalItems { get; init; }
    public int TotalTrades { get; init; }
    public int OpenDisputes { get; init; }
    public List<MonthlyStatDto> MonthlyActivity { get; init; } = [];
}

public sealed class MonthlyStatDto
{
    public string Month { get; init; } = string.Empty;
    public int Trades { get; init; }
    public int Revenue { get; init; }
}

public sealed record GetDashboardStatsQuery : IRequest<DashboardStatsDto>;

public sealed class GetDashboardStatsQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        var totalUsers = await dbContext.Users.CountAsync(cancellationToken);
        var totalItems = await dbContext.Items.CountAsync(cancellationToken);
        var totalTrades = await dbContext.Trades.CountAsync(cancellationToken);
        var openDisputes = await dbContext.Disputes.CountAsync(x => x.Status != Core.Enums.DisputeStatus.Resolved, cancellationToken);

        // Simple mock for monthly activity until we have enough data
        var months = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun" };
        var monthlyActivity = months.Select(m => new MonthlyStatDto
        {
            Month = m,
            Trades = Random.Shared.Next(10, 50),
            Revenue = Random.Shared.Next(100, 1000)
        }).ToList();

        return new DashboardStatsDto
        {
            TotalUsers = totalUsers,
            TotalItems = totalItems,
            TotalTrades = totalTrades,
            OpenDisputes = openDisputes,
            MonthlyActivity = monthlyActivity
        };
    }
}
