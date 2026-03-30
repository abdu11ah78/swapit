namespace SwapIt.Application.Features.Trades.Dtos;

public sealed class CreateTradeRequestDto
{
    public string ItemId { get; init; } = string.Empty;
    public string SellerId { get; init; } = string.Empty;
}
