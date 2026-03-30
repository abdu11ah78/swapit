namespace SwapIt.Application.Features.Notifications.Dtos;

public sealed class CreateNotificationRequestDto
{
    public string UserId { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
}
