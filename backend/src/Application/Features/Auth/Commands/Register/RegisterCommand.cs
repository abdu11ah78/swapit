using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Exceptions;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Application.Features.Auth.Dtos;
using SwapIt.Core.Entities;
using SwapIt.Core.Enums;

namespace SwapIt.Application.Features.Auth.Commands.Register;

public sealed record RegisterCommand(string? Name, string Email, string? PhoneNumber, string Password) : IRequest<RegisterResponseDto>;

public sealed class RegisterCommandHandler(
    IApplicationDbContext dbContext,
    IPasswordService passwordService,
    ITokenService tokenService) : IRequestHandler<RegisterCommand, RegisterResponseDto>
{
    public async Task<RegisterResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var existing = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
        if (existing is not null)
        {
            throw new AppException("Email already registered", 409);
        }

        var user = new User(Guid.NewGuid().ToString("N"), request.Email)
        {
            Name = request.Name,
            PhoneNumber = request.PhoneNumber,
            PasswordHash = passwordService.HashPassword(request.Password),
            Role = UserRole.User
        };

        dbContext.Users.Add(user);

        var verificationToken = tokenService.GenerateEmailVerificationToken(user);
        dbContext.EmailVerificationTokens.Add(new EmailVerificationToken(
            Guid.NewGuid().ToString("N"),
            verificationToken,
            user.Id,
            DateTime.UtcNow.AddHours(24)));

        await dbContext.SaveChangesAsync(cancellationToken);

        return new RegisterResponseDto
        {
            Message = "User registered. Verify email using verification token.",
            UserId = user.Id,
            VerificationToken = verificationToken
        };
    }
}
