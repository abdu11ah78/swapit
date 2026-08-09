using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Exceptions;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Core.Entities;
using SwapIt.Core.Enums;

namespace SwapIt.Application.Features.Auth.Commands.RequestReopen;

public record RequestReopenCommand(string Email, string Reason) : IRequest;

public class RequestReopenCommandHandler(IApplicationDbContext dbContext) : IRequestHandler<RequestReopenCommand>
{
    public async Task Handle(RequestReopenCommand request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
        if (user == null)
        {
            throw new AppException("User not found", 404);
        }

        if (!user.IsBanned)
        {
            throw new AppException("This account is not banned", 400);
        }

        // Check if there is already an open dispute for this user reopening request
        var alreadyRequested = await dbContext.Disputes.AnyAsync(d => 
            d.ReporterId == user.Id && 
            d.Reason.StartsWith("Account Reopening:") && 
            d.Status == DisputeStatus.Open, 
            cancellationToken);

        if (alreadyRequested)
        {
            throw new AppException("A reopening request is already pending review.", 400);
        }

        var dispute = new Dispute(Guid.NewGuid().ToString("N"), $"Account Reopening: {request.Reason}", user.Id)
        {
            Evidence = "Banned account reopening request.",
            Status = DisputeStatus.Open,
            ReportedUserId = user.Id
        };

        dbContext.Disputes.Add(dispute);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
