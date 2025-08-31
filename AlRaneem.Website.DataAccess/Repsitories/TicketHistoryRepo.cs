using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AlRaneem.Website.DataAccess.Repsitories
{
    public class TicketHistoryRepo : BaseRepo<TicketHistory, int>, ITicketHistoryRepo
    {
        private readonly ApplicationDbContext _context;
        public TicketHistoryRepo(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<TicketHistory>> GetTicketHistoryByTicketIdAsync(int ticketId)
        {
            return await _context.TicketHistory
                                 .Where(c => c.TicketId == ticketId)
                                 .Include(c => c.CreatedBy)
                                 .OrderBy(c => c.CreatedAt)
                                 .ToListAsync();
        }

        public async Task<TicketHistory> SaveHistoryAsync(TicketHistory ticketHistory)
        {
            if (ticketHistory == null)
                throw new ArgumentNullException(nameof(ticketHistory));

            await _context.TicketHistory.AddAsync(ticketHistory);
            return ticketHistory;
        }

    }
}
