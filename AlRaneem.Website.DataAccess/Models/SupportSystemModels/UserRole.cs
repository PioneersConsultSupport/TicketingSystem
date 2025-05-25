
using System.Text.Json.Serialization;

namespace AlRaneem.Website.DataAccess.Models.SupportSystemModels
{
    public class UserRole
    {
        public int Id { get; set; }
        public string UserEmail { get; set; }
        public string UserName { get; set; }
        public int UserRoleId { get; set; }
        [JsonIgnore]
        public ICollection<Ticket>? AssignedToTickets { get; set; }
        [JsonIgnore]
        public ICollection<Ticket>? CreatedByTickets { get; set; }
    }
}
