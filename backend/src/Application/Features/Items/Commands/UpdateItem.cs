using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Items.Commands;

public record UpdateItemCommand : IRequest
{
    public string Id { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Images { get; init; } = string.Empty;
    public string CategoryId { get; init; } = string.Empty;
    public string? ProvinceId { get; init; }
    public string Condition { get; init; } = string.Empty;
    public string? Location { get; init; }
    public int LtpValue { get; init; }
    public Dictionary<string, string> DynamicAttributes { get; init; } = [];
}

public class UpdateItemCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService) 
    : IRequestHandler<UpdateItemCommand>
{
    public async Task Handle(UpdateItemCommand request, CancellationToken cancellationToken)
    {
        var item = await context.Items
            .Include(x => x.AttributeValues)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (item == null)
            throw new Exception("Item not found");

        if (item.OwnerId != currentUserService.UserId && !currentUserService.IsAdmin)
            throw new Exception("Unauthorized to update this item");

        item.Title = request.Title;
        item.Description = request.Description;
        item.Images = request.Images;
        item.CategoryId = request.CategoryId;
        item.ProvinceId = request.ProvinceId;
        item.Condition = request.Condition;
        item.Location = request.Location;
        item.LtpValue = request.LtpValue;

        // Update attributes (simple clear and re-add for now)
        context.ItemAttributeValues.RemoveRange(item.AttributeValues);
        
        foreach (var attr in request.DynamicAttributes)
        {
            if (!string.IsNullOrEmpty(attr.Value))
            {
                item.AttributeValues.Add(new SwapIt.Core.Entities.ItemAttributeValue(
                    Guid.NewGuid().ToString(),
                    item.Id,
                    attr.Key,
                    attr.Value
                ));
            }
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}
