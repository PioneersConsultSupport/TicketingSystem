using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface ITicketHistoryRepo : IBaseRepo<TicketHistory, int>
    {
        Task<List<TicketHistory>> GetTicketHistoryByTicketIdAsync(int ticketId);
        Task<TicketHistory> SaveHistoryAsync(TicketHistory ticketHistory);

    }
}
