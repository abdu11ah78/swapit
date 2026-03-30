namespace SwapIt.Application.Features.Auth.Dtos;

public sealed class RegisterRequestDto
{
    public string? Name { get; init; }
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}
