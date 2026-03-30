namespace SwapIt.Application.Features.Trades.Dtos;

public sealed class TradeEventDto
{
    public string Id { get; init; } = string.Empty;
    public string? FromStatus { get; init; }
    public string ToStatus { get; init; } = string.Empty;
    public string? ActorId { get; init; }
    public string? Note { get; init; }
    public DateTime CreatedAt { get; init; }
}
