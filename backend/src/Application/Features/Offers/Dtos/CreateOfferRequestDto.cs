namespace SwapIt.Application.Features.Offers.Dtos;

public sealed class CreateOfferRequestDto
{
    public string TradeId { get; init; } = string.Empty;
    public int OfferedLtp { get; init; }
    public string? OfferedItemId { get; init; }
    public string[] OfferedItemIds { get; init; } = [];
    public string? Message { get; init; }
    public DateTime? ExpiresAt { get; init; }
    public string? ParentOfferId { get; init; }
}
