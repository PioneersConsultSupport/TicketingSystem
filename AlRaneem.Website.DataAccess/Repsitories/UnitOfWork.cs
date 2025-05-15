using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Interfaces;

namespace AlRaneem.Website.DataAccess.Repsitories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;

        public IEmployeeRepo employeeRepo { get; }
        public IUserRoleRepo userRoleRepo { get; }
        public ICategoryRepo categoryRepo { get; }
        public ICommentRepo commentRepo { get; }
        public ITicketRepo ticketRepo { get; }

        public UnitOfWork(ApplicationDbContext context,IEmployeeRepo employeeRepo, IUserRoleRepo userRepo, 
            ICategoryRepo categoryRepo, ICommentRepo commentRepo, ITicketRepo ticketRepo)
        {
            _context = context;
            this.employeeRepo = employeeRepo;
            this.userRoleRepo = userRepo;
            this.categoryRepo = categoryRepo;
            this.commentRepo = commentRepo;
            this.ticketRepo = ticketRepo;
        }

        public int Complete()
        {
            return _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}