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
            .Where(x => x.Status == ItemStatus.Available);

        if (!string.IsNullOrWhiteSpace(request.Q))
        {
            query = query.Where(x => x.Title.Contains(request.Q) || x.Description.Contains(request.Q));
        }

        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            query = query.Where(x => x.Category == request.Category);
        }

        if (!string.IsNullOrWhiteSpace(request.Location))
        {
            query = query.Where(x => x.Location.Contains(request.Location));
        }

        query = request.Sort switch
        {
            "value" => query.OrderByDescending(x => x.LtpValue),
            "relevance" when !string.IsNullOrWhiteSpace(request.Q) => query.OrderByDescending(x => x.LtpValue),
            _ => query.OrderByDescending(x => x.CreatedAt)
        };

        var items = await query.Take(50).ToListAsync(cancellationToken);

        var responseItems = items.Select(item =>
        {
            var dto = item.Adapt<ItemResponseDto>();
            return new ItemResponseDto
            {
                Id = dto.Id,
                Title = dto.Title,
                Description = dto.Description,
                Category = dto.Category,
                Condition = dto.Condition,
                Location = dto.Location,
                LtpValue = dto.LtpValue,
                Status = item.Status.ToString().ToUpperInvariant(),
                Images = ParseImages(item.Images),
                OwnerId = item.OwnerId,
                OwnerName = dto.OwnerName,
                OwnerTrustScore = dto.OwnerTrustScore,
                CreatedAt = item.CreatedAt
            };
        }).ToList();

        return new GetItemsResponseDto { Items = responseItems };
    }

    private static string[] ParseImages(string json)
    {
        try
        {
            return JsonSerializer.Deserialize<string[]>(json) ?? [];
        }
        catch
        {
            return [];
        }
    }
}
