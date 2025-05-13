using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using AlRaneem.Website.Shared.DataContract;

namespace AlRaneem.Website.DataAccess.Extensions
{
    public static class TicketExtensions
    {
        public static Ticket ToModel(this CreateTicketDto exam, string userId)
        {
            return new Ticket()
            {
                CategoryId = exam.CategoryId,
                Title = exam.Title,
                Description = exam.Description,
                Status = TicketStatus.Open,
                CreatedAt = DateTime.UtcNow
            };
        }
    }
}