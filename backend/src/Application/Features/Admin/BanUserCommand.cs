using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Exceptions;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Admin;

public record BanUserCommand(string UserId) : IRequest;

public class BanUserCommandHandler(IApplicationDbContext dbContext) : IRequestHandler<BanUserCommand>
{
    public async Task Handle(BanUserCommand request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
        if (user == null)
        {
            throw new AppException("User not found", 404);
        }

        user.IsBanned = true;
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
