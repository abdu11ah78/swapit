using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Items.Commands;

public record UpdateItemAiPriceCommand : IRequest
{
    public string Id { get; init; } = string.Empty;
    public int AiPrice { get; init; }
}

public class UpdateItemAiPriceCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService) 
    : IRequestHandler<UpdateItemAiPriceCommand>
{
    public async Task Handle(UpdateItemAiPriceCommand request, CancellationToken cancellationToken)
    {
        var item = await context.Items
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (item == null)
            throw new Exception("Item not found");

        if (item.OwnerId != currentUserService.UserId && !currentUserService.IsAdmin)
            throw new Exception("Unauthorized to update this item");

        item.LtpValue = request.AiPrice;
        item.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);
    }
}
