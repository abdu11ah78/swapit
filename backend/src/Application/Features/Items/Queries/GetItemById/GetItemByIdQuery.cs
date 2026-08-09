using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Items.Dtos;

namespace SwapIt.Application.Features.Items.Queries.GetItemById;

public sealed record GetItemByIdQuery(string Id) : IRequest<ItemResponseDto?>;

public sealed class GetItemByIdQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetItemByIdQuery, ItemResponseDto?>
{
    public async Task<ItemResponseDto?> Handle(GetItemByIdQuery request, CancellationToken cancellationToken)
    {
        var item = await dbContext.Items
            .AsNoTracking()
            .Include(x => x.Owner)
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (item is null)
            return null;

        return item.Adapt<ItemResponseDto>();
    }
}
