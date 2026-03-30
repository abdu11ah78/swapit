using Microsoft.AspNetCore.Identity;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Core.Entities;

namespace SwapIt.Infrastructure.Auth;

public sealed class PasswordService : IPasswordService
{
    private readonly PasswordHasher<User> _passwordHasher = new();

    public string HashPassword(string plainTextPassword)
    {
        return _passwordHasher.HashPassword(new User(Guid.NewGuid().ToString("N"), "placeholder@swapit.local"), plainTextPassword);
    }

    public bool VerifyPassword(string hashedPassword, string plainTextPassword)
    {
        var result = _passwordHasher.VerifyHashedPassword(
            new User(Guid.NewGuid().ToString("N"), "placeholder@swapit.local"),
            hashedPassword,
            plainTextPassword);

        return result is PasswordVerificationResult.Success or PasswordVerificationResult.SuccessRehashNeeded;
    }
}
