namespace SwapIt.Application.Features.Messages.Dtos;

public sealed class ConversationDto
{
    public string UserId { get; init; } = string.Empty;
    public string UserName { get; init; } = string.Empty;
    public string? UserImage { get; init; }
    public double UserTrustScore { get; init; }
    public string LastMessage { get; init; } = string.Empty;
    public DateTime LastMessageAt { get; init; }
    public bool IsOnline { get; init; } // Optional: can be derived if we add presence
}
