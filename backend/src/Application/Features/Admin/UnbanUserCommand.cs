using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Exceptions;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Admin;

public record UnbanUserCommand(string UserId) : IRequest;

public class UnbanUserCommandHandler(IApplicationDbContext dbContext) : IRequestHandler<UnbanUserCommand>
{
    public async Task Handle(UnbanUserCommand request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
        if (user == null)
        {
            throw new AppException("User not found", 404);
        }

        user.IsBanned = false;
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
