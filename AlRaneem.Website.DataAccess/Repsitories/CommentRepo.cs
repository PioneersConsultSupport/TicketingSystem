using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;

namespace AlRaneem.Website.DataAccess.Repsitories
{
    public class CommentRepo : BaseRepo<Comment, int>, ICommentRepo
    {
        private readonly ApplicationDbContext _context;
        public CommentRepo(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }
    }
}
