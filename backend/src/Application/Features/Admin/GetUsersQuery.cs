using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Admin;

public sealed class UserAdminDto
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public double TrustScore { get; init; }
    public int TradesCount { get; init; }
    public bool Suspicious { get; init; }
    public string Status { get; init; } = "active";
}

public sealed record GetUsersQuery : IRequest<List<UserAdminDto>>;

public sealed class GetUsersQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetUsersQuery, List<UserAdminDto>>
{
    public async Task<List<UserAdminDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        return await dbContext.Users
            .Select(u => new UserAdminDto
            {
                Id = u.Id,
                Name = u.Name ?? u.Email,
                Email = u.Email,
                Role = u.Role.ToString().ToLowerInvariant(),
                TrustScore = u.TrustScore,
                TradesCount = u.TradesAsBuyer.Count + u.TradesAsSeller.Count,
                Suspicious = u.TrustScore < 50,
                Status = "active" // Default for now
            })
            .ToListAsync(cancellationToken);
    }
}
