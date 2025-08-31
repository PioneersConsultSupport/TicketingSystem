using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AlRaneem.Website.DataAccess.Models.SupportSystemModels
{
    public class TicketHistory
    {
        public int Id { get; set; }
        public string[] HistoryDetails { get; set; } = Array.Empty<string>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int TicketId { get; set; }
        public Ticket? Ticket { get; set; }
        public int CreatedById { get; set; }
        public UserRole? CreatedBy { get; set; }
    }
}
