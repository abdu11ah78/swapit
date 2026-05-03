namespace SwapIt.Application.Features.Messages.Dtos;

public sealed class MessageDto
{
    public string Id { get; init; } = string.Empty;
    public string SenderId { get; init; } = string.Empty;
    public string ReceiverId { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public bool IsRead { get; init; }
    public DateTime CreatedAt { get; init; }
    public bool IsMine { get; set; } // Will be set in handler
}
