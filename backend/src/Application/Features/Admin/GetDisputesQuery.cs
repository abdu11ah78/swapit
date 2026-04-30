using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Admin;

public sealed class DisputeAdminDto
{
    public string Id { get; init; } = string.Empty;
    public string TradeId { get; init; } = string.Empty;
    public string ReporterName { get; init; } = string.Empty;
    public string Reason { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}

public sealed record GetDisputesQuery : IRequest<List<DisputeAdminDto>>;

public sealed class GetDisputesQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetDisputesQuery, List<DisputeAdminDto>>
{
    public async Task<List<DisputeAdminDto>> Handle(GetDisputesQuery request, CancellationToken cancellationToken)
    {
        return await dbContext.Disputes
            .Select(d => new DisputeAdminDto
            {
                Id = d.Id,
                TradeId = d.TradeId,
                ReporterName = d.Reporter.Name ?? d.Reporter.Email,
                Reason = d.Reason,
                Status = d.Status.ToString(),
                CreatedAt = d.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
