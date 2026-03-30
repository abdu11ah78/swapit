namespace SwapIt.Application.Features.Auth.Dtos;

public sealed class AuthUserDto
{
    public string Id { get; init; } = string.Empty;
    public string? Name { get; init; }
    public string Email { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
}
