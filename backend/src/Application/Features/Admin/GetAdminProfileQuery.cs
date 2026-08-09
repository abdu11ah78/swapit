using MediatR;
using SwapIt.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SwapIt.Application.Features.Admin;

public sealed class AdminProfileDto
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
}

public sealed record GetAdminProfileQuery : IRequest<AdminProfileDto>;

public sealed class GetAdminProfileQueryHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
    : IRequestHandler<GetAdminProfileQuery, AdminProfileDto>
{
    public async Task<AdminProfileDto> Handle(GetAdminProfileQuery request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException();
        }

        var user = await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        return new AdminProfileDto
        {
            Id = user.Id,
            Name = user.Name ?? "Admin",
            Email = user.Email,
            Role = user.Role.ToString(),
            AvatarUrl = $"https://ui-avatars.com/api/?name={user.Name ?? "Admin"}&background=B8C524&color=fff"
        };
    }
}
