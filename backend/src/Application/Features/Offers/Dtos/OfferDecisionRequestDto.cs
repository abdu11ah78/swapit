namespace SwapIt.Application.Features.Offers.Dtos;

public sealed class OfferDecisionRequestDto
{
    public string OfferId { get; init; } = string.Empty;
    public string Action { get; init; } = string.Empty;
}
