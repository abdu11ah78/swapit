using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Items.Dtos;
using Mapster;

namespace SwapIt.Application.Features.Profile;

public sealed record GetMyPostsQuery : IRequest<List<ItemResponseDto>>;

public sealed class GetMyPostsQueryHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
    : IRequestHandler<GetMyPostsQuery, List<ItemResponseDto>>
{
    public async Task<List<ItemResponseDto>> Handle(GetMyPostsQuery request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.UserId;
        var items = await dbContext.Items
            .Include(i => i.Category)
            .Include(i => i.Owner)
            .Where(i => i.OwnerId == userId)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync(cancellationToken);

        return items.Select(i => new ItemResponseDto
        {
            Id = i.Id,
            Title = i.Title,
            Description = i.Description,
            Category = i.Category.Name,
            Condition = i.Condition,
            Location = i.Location ?? "N/A",
            LtpValue = i.LtpValue,
            Status = i.Status.ToString(),
            Images = i.Images.Split(',', StringSplitOptions.RemoveEmptyEntries),
            OwnerId = i.OwnerId,
            OwnerName = i.Owner.Name,
            OwnerTrustScore = i.Owner.TrustScore,
            CreatedAt = i.CreatedAt
        }).ToList();
    }
}
