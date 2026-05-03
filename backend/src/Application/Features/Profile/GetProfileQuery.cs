using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Profile;

public sealed class ProfileDto
{
    public string Id { get; init; } = string.Empty;
    public string? Name { get; init; }
    public string Email { get; init; } = string.Empty;
    public string? Image { get; init; }
    public string? PhoneNumber { get; init; }
    public string Role { get; init; } = string.Empty;
    public int LtpBalance { get; init; }
    public bool IsLocationPublic { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public string? City { get; init; }
    public double TrustScore { get; init; }
    public DateTime CreatedAt { get; init; }
}

public sealed record GetProfileQuery : IRequest<ProfileDto>;

public sealed class GetProfileQueryHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
    : IRequestHandler<GetProfileQuery, ProfileDto>
{
    public async Task<ProfileDto> Handle(GetProfileQuery request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.UserId;
        var user = await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        return new ProfileDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Image = user.Image,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role.ToString(),
            LtpBalance = user.LtpBalance,
            IsLocationPublic = user.IsLocationPublic,
            Latitude = user.Latitude,
            Longitude = user.Longitude,
            City = user.City,
            TrustScore = user.TrustScore,
            CreatedAt = user.CreatedAt
        };
    }
}
