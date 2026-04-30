using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Admin;

public sealed class ItemAdminDto
{
    public string Id { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public List<string> Images { get; init; } = [];
    public string Category { get; init; } = string.Empty;
    public string Condition { get; init; } = string.Empty;
    public string Location { get; init; } = string.Empty;
    public int LtpValue { get; init; }
    public string Status { get; init; } = string.Empty;
    public string OwnerName { get; init; } = string.Empty;
}

public sealed record GetAdminItemsQuery : IRequest<List<ItemAdminDto>>;

public class GetAdminItemsQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetAdminItemsQuery, List<ItemAdminDto>>
{
    public async Task<List<ItemAdminDto>> Handle(GetAdminItemsQuery request, CancellationToken cancellationToken)
    {
        var items = await dbContext.Items
            .Include(i => i.Owner)
            .Include(i => i.Category) // Include Category object
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync(cancellationToken);

        return items.Select(i => new ItemAdminDto
        {
            Id = i.Id,
            Title = i.Title,
            Description = i.Description,
            Images = System.Text.Json.JsonSerializer.Deserialize<List<string>>(i.Images) ?? [],
            Category = i.Category?.Name ?? "General", // Use Category Name
            Condition = i.Condition,
            Location = i.Location ?? "Global",
            LtpValue = i.LtpValue,
            Status = i.Status.ToString(),
            OwnerName = i.Owner.Name ?? i.Owner.Email
        }).ToList();
    }
}
