using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Items.Commands;

public record DeleteItemCommand(string Id) : IRequest;

public class DeleteItemCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService) 
    : IRequestHandler<DeleteItemCommand>
{
    public async Task Handle(DeleteItemCommand request, CancellationToken cancellationToken)
    {
        var item = await context.Items
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (item == null)
            throw new Exception("Item not found");

        if (item.OwnerId != currentUserService.UserId && !currentUserService.IsAdmin)
            throw new Exception("Unauthorized to delete this item");

        context.Items.Remove(item);
        await context.SaveChangesAsync(cancellationToken);
    }
}
