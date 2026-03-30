using System.Security.Claims;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.API.Common.Services;

public sealed class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public string UserId
    {
        get
        {
            var value = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)
                        ?? httpContextAccessor.HttpContext?.User.FindFirstValue("sub");

            return value ?? throw new UnauthorizedAccessException("User context is missing.");
        }
    }
}
