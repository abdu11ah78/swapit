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

    public bool IsAdmin
    {
        get
        {
            var role = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Role);
            return string.Equals(role, "ADMIN", StringComparison.OrdinalIgnoreCase);
        }
    }
}
