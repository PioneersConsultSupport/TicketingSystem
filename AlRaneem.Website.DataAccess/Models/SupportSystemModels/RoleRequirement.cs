using AlRaneem.Website.DataAccess.Enums;
using Microsoft.AspNetCore.Authorization;

namespace AlRaneem.Website.DataAccess.Models.SupportSystemModels
{
    public class RoleRequirement : IAuthorizationRequirement
    {
        public UserRoles Role { get; }

        public RoleRequirement(UserRoles role)
        {
            Role = role;
        }
    }
}
