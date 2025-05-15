using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.AspNetCore.Authorization;

namespace AlRaneem.Website.Server.handlers
{
    public class RoleAuthorizationHandler : AuthorizationHandler<RoleRequirement>
    {
        private readonly IUserRoleRepo _userRoleRepo;

        public RoleAuthorizationHandler(IUserRoleRepo userRoleRepo)
        {
            _userRoleRepo = userRoleRepo;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, RoleRequirement requirement)
        {
            var email = context.User?.Identity?.Name;

            if (email == null)
                return;

            var user = _userRoleRepo.GetUserRoleByEmailAsync(email).Result;
            if (user != null) return;

            if (user?.UserRoleId == (int)requirement.Role)
            {
                context.Succeed(requirement);
            }
        }
    }
}
