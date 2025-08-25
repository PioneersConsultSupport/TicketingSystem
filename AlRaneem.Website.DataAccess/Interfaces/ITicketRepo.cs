using AlRaneem.Website.DataAccess.Models.SupportSystemModels;

namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface ITicketRepo : IBaseRepo<Ticket, int>
    {
        Task<Ticket?> GetLastTicketAsync();

    }


}
