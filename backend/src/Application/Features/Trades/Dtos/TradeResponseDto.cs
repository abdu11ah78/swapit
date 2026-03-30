namespace SwapIt.Application.Features.Trades.Dtos;

public sealed class TradeResponseDto
{
    public string Id { get; init; } = string.Empty;
    public string BuyerId { get; init; } = string.Empty;
    public string SellerId { get; init; } = string.Empty;
    public string ItemId { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public bool EscrowHold { get; init; }
    public DateTime? CompletedAt { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
    public IReadOnlyList<TradeEventDto> Lifecycle { get; init; } = [];
}
