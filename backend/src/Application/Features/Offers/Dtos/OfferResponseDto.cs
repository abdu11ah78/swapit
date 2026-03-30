namespace SwapIt.Application.Features.Offers.Dtos;

public sealed class OfferResponseDto
{
    public string Id { get; init; } = string.Empty;
    public string TradeId { get; init; } = string.Empty;
    public string MakerId { get; init; } = string.Empty;
    public int OfferedLtp { get; init; }
    public string? Message { get; init; }
    public string Status { get; init; } = string.Empty;
    public DateTime? ExpiresAt { get; init; }
    public string? OfferedItemId { get; init; }
    public string? ParentOfferId { get; init; }
    public IReadOnlyList<string> ItemIds { get; init; } = [];
    public DateTime CreatedAt { get; init; }
}
