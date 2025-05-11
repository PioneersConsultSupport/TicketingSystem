using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;

namespace AlRaneem.Website.DataAccess.Repsitories
{
    public class TicketRepo : BaseRepo<Ticket, int>, ITicketRepo
    {
        private readonly ApplicationDbContext _context;
        public TicketRepo(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }
    }
}
