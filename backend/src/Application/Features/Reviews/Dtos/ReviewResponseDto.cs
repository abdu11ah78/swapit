namespace SwapIt.Application.Features.Reviews.Dtos;

public sealed class ReviewResponseDto
{
    public string Id { get; init; } = string.Empty;
    public string AuthorId { get; init; } = string.Empty;
    public string TargetId { get; init; } = string.Empty;
    public string? TradeId { get; init; }
    public int Rating { get; init; }
    public string? Comment { get; init; }
    public DateTime CreatedAt { get; init; }
    public double TrustScore { get; init; }
}
