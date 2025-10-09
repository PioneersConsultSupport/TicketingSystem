using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Enums;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Azure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using System.Collections.Generic;
using System.Linq.Expressions;


namespace AlRaneem.Website.DataAccess.Repsitories
{
    public class UserRoleRepo : IUserRoleRepo
    {
        private readonly ApplicationDbContext _context;
        private readonly GraphServiceClient _graphClient;
        private readonly AzureConfig _azureConfig;
        public UserRoleRepo(ApplicationDbContext context, IOptions<AzureConfig> azureConfig, IConfiguration config)
        {
            _context = context;
            _azureConfig = azureConfig.Value;

            var clientSecretCredential = new ClientSecretCredential(
                _azureConfig.TenantId, _azureConfig.ClientId, _azureConfig.ClientIdValue);

            _graphClient = new GraphServiceClient(clientSecretCredential);
        }

        public void AddUserRole(UserRole userRole)
        {
            _context.Add(userRole);
        }

        public void DeleteUserRole(UserRole userRole)
        {
            _context.Remove(userRole);
        }

        public async Task<List<AzureUser>> GetAllUsersAsync()
        {
            var usersPage = await _graphClient.Users.GetAsync();

            return usersPage.Value
                .Select(x => new AzureUser
                {
                    Id = x.Id,
                    DisplayName = $"{x.DisplayName} ({x.Mail})",
                    Mail = x.Mail,
                    UserPrincipalName = x.UserPrincipalName,
                }).ToList();
        }

        public async Task<List<AzureUser>> GetAllUsersAsync2()
        {
            var allUsers = new List<User>();
            var result = await _graphClient.Users.GetAsync();

            allUsers.AddRange(result.Value);

            while (!string.IsNullOrEmpty(result.OdataNextLink))
            {
                result = await _graphClient.Users.WithUrl(result.OdataNextLink).GetAsync();
                allUsers.AddRange(result.Value);
            }

            return allUsers
                .Select(x => new AzureUser
                {
                    Id = x.Id,
                    DisplayName = $"{x.DisplayName} ({x.Mail})",
                    Mail = x.Mail,
                    UserPrincipalName = x.UserPrincipalName,
                }).ToList();
        }

        public async Task<List<UserRole>> GetAllUsersRolesAsync()
        {
            var result = _context.userRoles.AsNoTracking().ToList();
            return result;
        }

        public async Task<UserRole> FindUserRoleByConditionAsync(Expression<Func<UserRole, bool>> criteria)
        {
            var result = _context.userRoles.SingleOrDefault(criteria);
            return result;
        }

        public async Task<List<UserRole>> GetUserRoleByRoleAsync(int role)
        {
            var result = _context.userRoles.Where(x => x.UserRoleId == role).ToList();
            return result;
        }

        public async Task UpdateUserRoleAsync(UserRole userRole)
        {
            var existingUserRole = await _context.userRoles.FindAsync(userRole.Id);
            if (existingUserRole == null)
                throw new Exception("UserRole not found");
            existingUserRole.UserRoleId = userRole.UserRoleId;
        }
    }
}
