namespace SwapIt.Application.Features.Notifications.Dtos;

public sealed class NotificationResponseDto
{
    public string Id { get; init; } = string.Empty;
    public string UserId { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public bool Read { get; init; }
    public DateTime CreatedAt { get; init; }
}
