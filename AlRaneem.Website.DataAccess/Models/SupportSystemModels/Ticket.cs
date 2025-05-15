using AlRaneem.Website.DataAccess.Enums;

namespace AlRaneem.Website.DataAccess.Models.SupportSystemModels
{
    public class Ticket
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public TicketStatus Status { get; set; } = TicketStatus.Open;

        public TicketPriority Priority { get; set; } = TicketPriority.Medium;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedById { get; set; }
        public ApplicationUser CreatedBy { get; set; }
        public string? AssignedToId { get; set; } // Added AssignedTo field
        public ApplicationUser? AssignedTo { get; set; } // Navigation property
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public int SubcategoryId { get; set; } 
        public Subcategory Subcategory { get; set; }

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
