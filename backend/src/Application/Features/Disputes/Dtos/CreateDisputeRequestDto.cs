namespace SwapIt.Application.Features.Disputes.Dtos;

public sealed class CreateDisputeRequestDto
{
    public string TradeId { get; init; } = string.Empty;
    public string Reason { get; init; } = string.Empty;
    public string? Evidence { get; init; }
}
