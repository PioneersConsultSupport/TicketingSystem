using AlRaneem.Website.DataAccess.Enums;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using AlRaneem.Website.DataAccess.Repsitories;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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

            var user = _userRoleRepo
            .FindUserRoleByConditionAsync(x => x.UserEmail == email)
            .Result;

            if (user == null) return;

            if ((int)requirement.Role == (int)UserRoles.Admin && user?.UserRoleId != (int)requirement.Role)
            {
                return;
            }

            context.Succeed(requirement);
        }
    }
}
