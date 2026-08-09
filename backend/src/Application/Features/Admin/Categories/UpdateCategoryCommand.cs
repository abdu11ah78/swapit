using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Core.Entities;

namespace SwapIt.Application.Features.Admin.Categories;

public record UpdateCategoryCommand(string Id, string Name, string Icon, string? ParentId, List<UpdateAttributeDto> Attributes) : IRequest;
public record UpdateAttributeDto(string? Id, string Name, string Type, bool IsRequired, string? Options);

public class UpdateCategoryCommandHandler(IApplicationDbContext dbContext) : IRequestHandler<UpdateCategoryCommand>
{
    public async Task Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await dbContext.Categories
            .Include(c => c.Attributes)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null) return;

        category.Name = request.Name;
        category.Icon = request.Icon;
        category.ParentId = request.ParentId;

        // Simple strategy: Remove old attributes and add new ones
        // In a production app, you'd match by ID to preserve existing data links,
        // but for a dynamic taxonomy engine, refreshing them is often safer for schema changes.
        category.Attributes.Clear();

        foreach (var attr in request.Attributes)
        {
            category.Attributes.Add(new CategoryAttribute(Guid.NewGuid().ToString("N"), attr.Name, attr.Type, category.Id)
            {
                IsRequired = attr.IsRequired,
                Options = attr.Options
            });
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
