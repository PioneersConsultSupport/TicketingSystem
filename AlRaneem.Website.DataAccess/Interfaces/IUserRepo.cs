using AlRaneem.Website.DataAccess.Models;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;

namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface IUserRoleRepo
    {
        Task<List<AzureUser>> GetAllUsersAsync();
        void AddUserRole(UserRole userRole);
    }


}
