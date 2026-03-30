using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Core.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SwapIt.Infrastructure.Auth;

public sealed class TokenService(IConfiguration configuration) : ITokenService
{
    public string GenerateAccessToken(User user)
    {
        var issuer = configuration["Jwt:Issuer"] ?? "SwapIt.API";
        var audience = configuration["Jwt:Audience"] ?? "SwapIt.Client";
        var key = configuration["Jwt:Key"] ?? "REPLACE_ME_WITH_A_SECURE_MIN_32_CHAR_KEY";
        var expiresMinutes = int.TryParse(configuration["Jwt:AccessTokenMinutes"], out var val) ? val : 60;

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.Role, user.Role.ToString().ToUpperInvariant())
        };

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateEmailVerificationToken(User user)
    {
        var issuer = configuration["Jwt:Issuer"] ?? "SwapIt.API";
        var audience = configuration["Jwt:Audience"] ?? "SwapIt.Client";
        var key = configuration["Jwt:Key"] ?? "REPLACE_ME_WITH_A_SECURE_MIN_32_CHAR_KEY";

        var claims = new List<Claim>
        {
            new("purpose", "email_verification"),
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email)
        };

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
