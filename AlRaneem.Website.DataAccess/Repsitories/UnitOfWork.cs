using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Interfaces;

namespace AlRaneem.Website.DataAccess.Repsitories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;

        public IEmployeeRepo employeeRepo { get; }
        public IUserRoleRepo userRoleRepo { get; }
        public ICommentRepo commentRepo { get; }
        public ITicketRepo ticketRepo { get; }
        public ICategoryRepo categoryRepo { get; }
        public ISubcategoryRepo subcategoryRepo { get; }
        public ITicketHistoryRepo ticketHistoryRepo { get; }


        public UnitOfWork(ApplicationDbContext context, IEmployeeRepo employeeRepo, IUserRoleRepo userRepo,
            ICommentRepo commentRepo, ITicketRepo ticketRepo, ICategoryRepo categoryRepo, ISubcategoryRepo subcategoryRepo, ITicketHistoryRepo ticketHistoryRepo)
        {
            _context = context;
            this.employeeRepo = employeeRepo;
            this.userRoleRepo = userRepo;
            this.commentRepo = commentRepo;
            this.ticketRepo = ticketRepo;
            this.categoryRepo = categoryRepo;
            this.subcategoryRepo = subcategoryRepo;
            this.ticketHistoryRepo = ticketHistoryRepo;
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