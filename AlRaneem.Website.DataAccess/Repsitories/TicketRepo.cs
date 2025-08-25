using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.EntityFrameworkCore;

namespace AlRaneem.Website.DataAccess.Repsitories
{
    public class TicketRepo : BaseRepo<Ticket, int>, ITicketRepo
    {
        private readonly ApplicationDbContext _context;
        public TicketRepo(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }
        public async Task<Ticket?> GetLastTicketAsync()
        {
            return await _context.Tickets
                .OrderByDescending(t => t.Id)
                .FirstOrDefaultAsync();
        }
    }
}
