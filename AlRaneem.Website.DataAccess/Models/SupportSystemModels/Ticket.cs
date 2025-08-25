
namespace AlRaneem.Website.DataAccess.Models.SupportSystemModels
{
    public class Ticket
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string RefNumber { get; set; } = string.Empty;
        public int? PriorityId { get; set; }
        public Subcategory? Priority { get; set; }

        public int? StatusId { get; set; }
        public Subcategory? Status { get; set; }

        public int? SupportOptionId { get; set; }
        public Subcategory? supportOption { get; set; }
        public int? CategoryId { get; set; }
        public Category? Category { get; set; }

        public int? SubcategoryId { get; set; }
        public Subcategory? Subcategory { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int? AssignedToId { get; set; }
        public UserRole? AssignedTo { get; set; }

        public int? CreatedById { get; set; }
        public UserRole? CreatedBy { get; set; }
    }
}
