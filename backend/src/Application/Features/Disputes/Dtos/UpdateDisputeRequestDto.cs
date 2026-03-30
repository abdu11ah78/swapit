namespace SwapIt.Application.Features.Disputes.Dtos;

public sealed class UpdateDisputeRequestDto
{
    public string DisputeId { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public string? Resolution { get; init; }
}
