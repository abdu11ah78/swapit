using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Admin;

/// <summary>
/// Command to update non-sensitive profile information like Name.
/// </summary>
public sealed record UpdateAdminNameCommand(string Name) : IRequest;

public sealed class UpdateAdminNameCommandHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
    : IRequestHandler<UpdateAdminNameCommand>
{
    public async Task Handle(UpdateAdminNameCommand request, CancellationToken cancellationToken)
    {
        // Get current admin ID
        var userId = currentUserService.UserId;
        if (string.IsNullOrEmpty(userId)) throw new UnauthorizedAccessException();

        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (user == null) throw new Exception("User not found");

        // Update name
        user.Name = request.Name;
        user.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
