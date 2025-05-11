using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models;

namespace AlRaneem.Website.DataAccess.Repsitories
{
    public class EmployeeRepo : BaseRepo<Employee, Guid>, IEmployeeRepo
    {
        private readonly ApplicationDbContext _context;
        public EmployeeRepo(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }
    }
}
