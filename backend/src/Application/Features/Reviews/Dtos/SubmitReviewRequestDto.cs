namespace SwapIt.Application.Features.Reviews.Dtos;

public sealed class SubmitReviewRequestDto
{
    public string TradeId { get; init; } = string.Empty;
    public string TargetId { get; init; } = string.Empty;
    public int Rating { get; init; }
    public string? Comment { get; init; }
}
