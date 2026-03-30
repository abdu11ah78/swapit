using SwapIt.Core.Entities;

namespace SwapIt.Application.Common.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateEmailVerificationToken(User user);
}
