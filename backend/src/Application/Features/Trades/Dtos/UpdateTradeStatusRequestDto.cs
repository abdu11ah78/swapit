namespace SwapIt.Application.Features.Trades.Dtos;

public sealed class UpdateTradeStatusRequestDto
{
    public string Status { get; init; } = string.Empty;
    public string? Note { get; init; }
}
