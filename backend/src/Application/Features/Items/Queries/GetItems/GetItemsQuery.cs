using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Items.Dtos;
using SwapIt.Core.Enums;
using System.Text.Json;

namespace SwapIt.Application.Features.Items.Queries.GetItems;

public sealed record GetItemsQuery(string? Q, string? Category, string? Location, string Sort = "latest")
    : IRequest<GetItemsResponseDto>;

public sealed class GetItemsResponseDto
{
    public IReadOnlyList<ItemResponseDto> Items { get; init; } = [];
}

public sealed class GetItemsQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetItemsQuery, GetItemsResponseDto>
{
    public async Task<GetItemsResponseDto> Handle(GetItemsQuery request, CancellationToken cancellationToken)
    {
        var query = dbContext.Items
            .AsNoTracking()
            .Include(x => x.Owner)
            .Include(x => x.Category) // Ensure Category is loaded
            .Where(x => x.Status == ItemStatus.Available);

        if (!string.IsNullOrWhiteSpace(request.Q))
        {
            query = query.Where(x => x.Title.Contains(request.Q) || x.Description.Contains(request.Q));
        }

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            var targetCategory = await dbContext.Categories
                .AsNoTracking()
                .Include(c => c.Children)
                .ThenInclude(c => c.Children)
                .FirstOrDefaultAsync(c => c.Name == request.Category || c.Id == request.Category, cancellationToken);

            if (targetCategory != null)
            {
                var categoryIds = new List<string> { targetCategory.Id };
                foreach (var sub in targetCategory.Children)
                {
                    categoryIds.Add(sub.Id);
                    foreach (var leaf in sub.Children)
                    {
                        categoryIds.Add(leaf.Id);
                    }
                }
                query = query.Where(x => categoryIds.Contains(x.CategoryId));
            }
            else
            {
                query = query.Where(x => x.Category.Name == request.Category || x.CategoryId == request.Category);
            }
        }

        if (!string.IsNullOrWhiteSpace(request.Location))
        {
            // Fallback check for location string or link to Province
            query = query.Where(x => x.Location != null && x.Location.Contains(request.Location));
        }

        query = request.Sort switch
        {
            "value" => query.OrderByDescending(x => x.LtpValue),
            "relevance" when !string.IsNullOrWhiteSpace(request.Q) => query.OrderByDescending(x => x.LtpValue),
            _ => query.OrderByDescending(x => x.CreatedAt)
        };

        var items = await query.Take(50).ToListAsync(cancellationToken);

        var responseItems = items.Adapt<List<ItemResponseDto>>();

        return new GetItemsResponseDto { Items = responseItems };
    }
}
