using AlRaneem.Website.DataAccess.Models.SupportSystemModels;

namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface IUserRoleRepo
    {
        Task<List<AzureUser>> GetAllUsersAsync();
        void AddUserRole(UserRole userRole);
        void UpdateUserRole(UserRole userRole);
        void DeleteUserRole(UserRole userRole);
        Task<List<UserRole>> GetAllUsersRolesAsync();
        Task<UserRole> GetUserRoleByEmailAsync(string userEmail);
    }
}
