using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Exceptions;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Auth.Dtos;

namespace SwapIt.Application.Features.Auth.Commands.Login;

public sealed record LoginCommand(string Email, string Password) : IRequest<LoginResponseDto>;

public sealed class LoginCommandHandler(
    IApplicationDbContext dbContext,
    IPasswordService passwordService,
    ITokenService tokenService) : IRequestHandler<LoginCommand, LoginResponseDto>
{
    public async Task<LoginResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
        if (user is null || string.IsNullOrWhiteSpace(user.PasswordHash))
        {
            throw new AppException("Invalid credentials", 401);
        }

        var isValid = passwordService.VerifyPassword(user.PasswordHash, request.Password);
        if (!isValid)
        {
            throw new AppException("Invalid credentials", 401);
        }

        return new LoginResponseDto
        {
            Token = tokenService.GenerateAccessToken(user),
            Role = user.Role.ToString().ToUpperInvariant(),
            UserId = user.Id
        };
    }
}
