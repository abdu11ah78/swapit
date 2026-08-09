using MediatR;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Admin.Categories;

public record ToggleCategoryCommand(string Id) : IRequest;

public class ToggleCategoryCommandHandler(IApplicationDbContext dbContext) : IRequestHandler<ToggleCategoryCommand>
{
    public async Task Handle(ToggleCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await dbContext.Categories.FindAsync([request.Id], cancellationToken);
        if (category != null)
        {
            category.IsActive = !category.IsActive;
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
