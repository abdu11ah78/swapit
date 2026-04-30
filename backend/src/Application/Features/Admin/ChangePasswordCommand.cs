using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Admin;

/// <summary>
/// Command to change administrator password requiring current password verification.
/// </summary>
public sealed record ChangePasswordCommand(string CurrentPassword, string NewPassword) : IRequest;

public sealed class ChangePasswordCommandHandler(
    IApplicationDbContext dbContext, 
    ICurrentUserService currentUserService, 
    IPasswordService passwordService)
    : IRequestHandler<ChangePasswordCommand>
{
    public async Task Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        // Identify active administrator
        var userId = currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("Session expired or invalid.");
        }

        var user = await dbContext.Users
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user == null)
        {
            throw new Exception("Account verification failed.");
        }

        // Verify existing password before allowing change
        bool isCurrentPasswordValid = passwordService.VerifyPassword(user.PasswordHash ?? "", request.CurrentPassword);
        if (!isCurrentPasswordValid)
        {
            throw new Exception("The current password you entered is incorrect.");
        }

        // Hash and store the new credentials
        user.PasswordHash = passwordService.HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        // Persist security update
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
