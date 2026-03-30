namespace SwapIt.Application.Features.Auth.Dtos;

public sealed class LoginResponseDto
{
    public string Token { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public string UserId { get; init; } = string.Empty;
}
