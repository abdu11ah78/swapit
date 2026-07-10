using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Admin.Categories;

public record CategoryDto(string Id, string Name, string Icon, bool IsActive, string? ParentId, List<AttributeDto> Attributes);
public record AttributeDto(string Id, string Name, string Type, bool IsRequired, string? Options);

public record GetCategoriesQuery : IRequest<List<CategoryDto>>;

public class GetCategoriesQueryHandler(IApplicationDbContext dbContext) : IRequestHandler<GetCategoriesQuery, List<CategoryDto>>
{
    public async Task<List<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        return await dbContext.Categories
            .Include(c => c.Attributes)
            .Select(c => new CategoryDto(
                c.Id,
                c.Name,
                c.Icon,
                c.IsActive,
                c.ParentId,
                c.Attributes.Select(a => new AttributeDto(a.Id, a.Name, a.Type, a.IsRequired, a.Options)).ToList()
            ))
            .ToListAsync(cancellationToken);
    }
}
