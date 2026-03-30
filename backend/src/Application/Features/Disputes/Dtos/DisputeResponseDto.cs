namespace SwapIt.Application.Features.Disputes.Dtos;

public sealed class DisputeResponseDto
{
    public string Id { get; init; } = string.Empty;
    public string TradeId { get; init; } = string.Empty;
    public string ReporterId { get; init; } = string.Empty;
    public string? ReviewerId { get; init; }
    public string Reason { get; init; } = string.Empty;
    public string? Evidence { get; init; }
    public string Status { get; init; } = string.Empty;
    public string? Resolution { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}
