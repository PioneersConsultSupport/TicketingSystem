using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.EntityFrameworkCore;

namespace AlRaneem.Website.DataAccess.Repsitories
{
    public class CommentRepo : BaseRepo<Comment, int>, ICommentRepo
    {
        private readonly ApplicationDbContext _context;
        public CommentRepo(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Comment>> GetCommentsByTicketIdAsync(int ticketId)
        {
            return await _context.Comments
                                 .Where(c => c.TicketId == ticketId)
                                 .Include(c => c.CreatedBy)
                                 .OrderBy(c => c.CreatedAt)
                                 .ToListAsync();
        }

    }
}
