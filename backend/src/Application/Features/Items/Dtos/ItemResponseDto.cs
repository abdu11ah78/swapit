namespace SwapIt.Application.Features.Items.Dtos;

public sealed class ItemResponseDto
{
    public string Id { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public string Condition { get; init; } = string.Empty;
    public string Location { get; init; } = string.Empty;
    public int LtpValue { get; init; }
    public string Status { get; init; } = string.Empty;
    public string[] Images { get; init; } = [];
    public string OwnerId { get; init; } = string.Empty;
    public string? OwnerName { get; init; }
    public double OwnerTrustScore { get; init; }
    public DateTime CreatedAt { get; init; }
}
