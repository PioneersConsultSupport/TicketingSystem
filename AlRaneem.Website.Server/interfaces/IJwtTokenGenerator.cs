using System.Security.Claims;

namespace AlRaneem.Website.Server.interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(ClaimsPrincipal principal);
    }
}
