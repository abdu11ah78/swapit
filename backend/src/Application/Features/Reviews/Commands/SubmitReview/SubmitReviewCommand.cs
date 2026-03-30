using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Exceptions;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Reviews.Dtos;
using SwapIt.Core.Entities;
using SwapIt.Core.Enums;

namespace SwapIt.Application.Features.Reviews.Commands.SubmitReview;

public sealed record SubmitReviewCommand(string UserId, string TradeId, string TargetId, int Rating, string? Comment) : IRequest<ReviewResponseDto>;

public sealed class SubmitReviewCommandHandler(IApplicationDbContext dbContext) : IRequestHandler<SubmitReviewCommand, ReviewResponseDto>
{
    public async Task<ReviewResponseDto> Handle(SubmitReviewCommand request, CancellationToken cancellationToken)
    {
        var trade = await dbContext.Trades.FirstOrDefaultAsync(t => t.Id == request.TradeId, cancellationToken);
        if (trade is null)
        {
            throw new AppException("Trade not found", 404);
        }

        if (trade.Status != TradeStatus.Completed)
        {
            throw new AppException("Review allowed only for completed trades", 400);
        }

        var participant = request.UserId == trade.BuyerId || request.UserId == trade.SellerId;
        var validTarget = request.TargetId == trade.BuyerId || request.TargetId == trade.SellerId;
        if (!participant || !validTarget)
        {
            throw new AppException("Forbidden target user", 403);
        }

        if (request.UserId == request.TargetId)
        {
            throw new AppException("Cannot review yourself", 400);
        }

        var review = await dbContext.Reviews.FirstOrDefaultAsync(
            r => r.AuthorId == request.UserId && r.TargetId == request.TargetId && r.TradeId == request.TradeId,
            cancellationToken);

        if (review is null)
        {
            review = new Review(Guid.NewGuid().ToString("N"), request.Rating, request.UserId, request.TargetId)
            {
                TradeId = request.TradeId,
                Comment = request.Comment
            };
            dbContext.Reviews.Add(review);
        }
        else
        {
            review.Rating = request.Rating;
            review.Comment = request.Comment;
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        var trustScore = await RecalculateTrustScore(request.TargetId, cancellationToken);
        var dto = review.Adapt<ReviewResponseDto>();
        return new ReviewResponseDto
        {
            Id = dto.Id,
            AuthorId = dto.AuthorId,
            TargetId = dto.TargetId,
            TradeId = dto.TradeId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = dto.CreatedAt,
            TrustScore = trustScore
        };
    }

    private async Task<double> RecalculateTrustScore(string targetId, CancellationToken cancellationToken)
    {
        var allRatings = await dbContext.Reviews
            .AsNoTracking()
            .Where(r => r.TargetId == targetId)
            .Select(r => r.Rating)
            .ToListAsync(cancellationToken);

        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == targetId, cancellationToken);
        if (user is null || allRatings.Count == 0)
        {
            return user?.TrustScore ?? 100d;
        }

        var average = allRatings.Average();
        user.TrustScore = Math.Round(average * 20d, 2);
        await dbContext.SaveChangesAsync(cancellationToken);
        return user.TrustScore;
    }
}
