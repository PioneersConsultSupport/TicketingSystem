using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface ITicketEmailService
    {
        Task SendTicketCreationEmails(Ticket ticket, UserRole creator, string clientEmail);
        Task SendTicketAssignmentEmail(Ticket ticket);
        Task SendTicketCompletionEmail(Ticket ticket);

    }
}
