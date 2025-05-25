
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Xml.Linq;

namespace AlRaneem.Website.Shared.DataContract
{
    public class TicketDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? CreatedById { get; set; }
        public int? StatusId { get; set; }
        public int? PriorityId { get; set; }
        public int? SupportTypeId { get; set; }
        public int? CategoryId { get; set; }
        public int? SubcategoryId { get; set; }
        public int? AssignedToId { get; set; }
    }
}
