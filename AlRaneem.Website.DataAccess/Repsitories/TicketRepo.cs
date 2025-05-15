using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Enums;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using AlRaneem.Website.DataAccess.Repsitories;
using Microsoft.EntityFrameworkCore;

namespace AlRaneem.Website.DataAccess.Repositories
{
    public class TicketRepo : BaseRepo<Ticket, int>, ITicketRepo
    {
        private readonly ApplicationDbContext _context;

        public TicketRepo(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Ticket> GetByIdAsync(int id)
        {
            return await _context.Tickets
                .Include(t => t.Category)
                .Include(t => t.Subcategory)
                .Include(t => t.Priority)
                .Include(t => t.Status)
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedTo)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<IEnumerable<string>> GetCategoriesAsync()
        {
            return await _context.Categories
                .Select(c => c.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetSubcategoriesAsync()
        {
            return await _context.Subcategories
                .Select(sc => sc.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetPrioritiesAsync()
        {
            return Enum.GetNames(typeof(TicketPriority));
        }
        public async Task<IEnumerable<string>> GetStatusesAsync()
        {
            return Enum.GetNames(typeof(Enums.TicketStatus));
        }
        
        public async Task UpdateAsync(Ticket ticket)
        {
            _context.Tickets.Update(ticket);
            await _context.SaveChangesAsync();
        }
    }
}
