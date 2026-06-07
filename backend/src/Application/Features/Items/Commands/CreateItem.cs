using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Core.Entities;

namespace SwapIt.Application.Features.Items.Commands;

public sealed record CreateItemCommand : IRequest<string>
{
    public required string Title { get; init; }
    public required string Description { get; init; }
    public required string Images { get; init; } // Comma separated string
    public required string CategoryId { get; init; }
    public string? ProvinceId { get; init; }
    public required string Condition { get; init; }
    public string? Location { get; init; }
    public int LtpValue { get; init; }
    public Dictionary<string, string> DynamicAttributes { get; init; } = new();
}

public sealed class CreateItemCommandHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
    : IRequestHandler<CreateItemCommand, string>
{
    public async Task<string> Handle(CreateItemCommand request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            throw new Exception("User not authenticated");
        }

        var id = Guid.NewGuid().ToString();
        var item = new Item(
            id,
            request.Title,
            request.Description,
            request.Images,
            request.CategoryId,
            request.Condition,
            userId
        )
        {
            ProvinceId = request.ProvinceId,
            Location = request.Location,
            LtpValue = request.LtpValue,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        dbContext.Items.Add(item);

        // Add dynamic attributes
        foreach (var attr in request.DynamicAttributes)
        {
            if (!string.IsNullOrEmpty(attr.Value))
            {
                var attrValue = new ItemAttributeValue(
                    Guid.NewGuid().ToString(),
                    id,
                    attr.Key, // This should be the AttributeId
                    attr.Value
                );
                dbContext.ItemAttributeValues.Add(attrValue);
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return id;
    }
}
