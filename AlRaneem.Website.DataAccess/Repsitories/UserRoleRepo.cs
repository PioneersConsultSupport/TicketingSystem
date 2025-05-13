using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Azure.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Graph.Models;


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
                _azureConfig.TenantId, _azureConfig.ClientId, config["AzureAd:ssssssss"]);

            _graphClient = new GraphServiceClient(clientSecretCredential);
        }

        public void AddUserRole(UserRole userRole)
        {
            _context.Add(userRole);
        }

        public async Task<List<AzureUser>> GetAllUsersAsync()
        {
            var usersPage = await _graphClient.Users.GetAsync();

            return usersPage.Value
                .Select(x => new AzureUser
                {
                Id = x.Id,
                DisplayName = x.DisplayName,
                Mail = x.Mail,
                UserPrincipalName = x.UserPrincipalName,
            }).ToList();
        }

    }
}
