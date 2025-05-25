using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using AlRaneem.Website.Shared.DataContract;

namespace AlRaneem.Website.DataAccess.Extensions
{
    public static class TicketExtensions
    {
        public static Ticket ToEntity(this TicketDto ticketDto)
        {
            return new Ticket()
            {
                Id = ticketDto.Id,
                Title = ticketDto.Title,
                Description = ticketDto.Description,
                CreatedAt = DateTime.Now,
                CreatedById = ticketDto.CreatedById,
                StatusId = ticketDto.StatusId,
                PriorityId = ticketDto.PriorityId,
                SupportTypeId = ticketDto.SupportTypeId,
                CategoryId = ticketDto.CategoryId,
                SubcategoryId = ticketDto.SubcategoryId,
                AssignedToId = ticketDto.AssignedToId,
            };
        }
    }
}