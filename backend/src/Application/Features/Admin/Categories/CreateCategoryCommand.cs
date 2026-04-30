using MediatR;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Core.Entities;

namespace SwapIt.Application.Features.Admin.Categories;

public record CreateCategoryCommand(string Name, string Icon, List<CreateAttributeDto> Attributes) : IRequest<string>;
public record CreateAttributeDto(string Name, string Type, bool IsRequired, string? Options);

public class CreateCategoryCommandHandler(IApplicationDbContext dbContext) : IRequestHandler<CreateCategoryCommand, string>
{
    public async Task<string> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = new Category(Guid.NewGuid().ToString("N"), request.Name, request.Icon);
        
        foreach (var attr in request.Attributes)
        {
            category.Attributes.Add(new CategoryAttribute(Guid.NewGuid().ToString("N"), attr.Name, attr.Type, category.Id)
            {
                IsRequired = attr.IsRequired,
                Options = attr.Options
            });
        }

        dbContext.Categories.Add(category);
        await dbContext.SaveChangesAsync(cancellationToken);
        
        return category.Id;
    }
}
