using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Profile;

public sealed record UpdateProfileCommand : IRequest<bool>
{
    public string? Name { get; init; }
    public string? Image { get; init; }
    public bool? IsLocationPublic { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public string? City { get; init; }
}

public sealed class UpdateProfileCommandHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
    : IRequestHandler<UpdateProfileCommand, bool>
{
    public async Task<bool> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.UserId;
        var user = await dbContext.Users
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user == null)
        {
            throw new Exception("User not found");
        }

        if (request.Name != null) user.Name = request.Name;
        if (request.Image != null) user.Image = request.Image;
        if (request.IsLocationPublic != null) user.IsLocationPublic = request.IsLocationPublic.Value;
        if (request.Latitude != null) user.Latitude = request.Latitude;
        if (request.Longitude != null) user.Longitude = request.Longitude;
        if (request.City != null) user.City = request.City;

        user.UpdatedAt = DateTime.UtcNow;
        
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
