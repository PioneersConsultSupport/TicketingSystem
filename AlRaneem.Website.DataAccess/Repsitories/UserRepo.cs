using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models;

namespace AlRaneem.Website.DataAccess.Repsitories
{
    public class UserRepo : BaseRepo<ApplicationUser, Guid>, IUserRepo
    {
        private readonly ApplicationDbContext _context;
        public UserRepo(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }
    }
}
