namespace SwapIt.Application.Features.Auth.Dtos;

public sealed class RegisterResponseDto
{
    public string Message { get; init; } = string.Empty;
    public string UserId { get; init; } = string.Empty;
    public string VerificationToken { get; init; } = string.Empty;
}
