using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using System.Linq.Expressions;

namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface IUserRoleRepo
    {
        Task<List<AzureUser>> GetAllUsersAsync();
        void AddUserRole(UserRole userRole);
        void UpdateUserRole(UserRole userRole);
        void DeleteUserRole(UserRole userRole);
        Task<List<UserRole>> GetAllUsersRolesAsync();
        Task<UserRole> FindUserRoleByConditionAsync(Expression<Func<UserRole, bool>> criteria);
        Task<List<UserRole>> GetUserRoleByRoleAsync(int role);
    }
}
