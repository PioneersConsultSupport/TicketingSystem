namespace AlRaneem.Website.DataAccess.Models.SupportSystemModels
{
    public class Ticket
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public TicketStatus Status { get; set; } = TicketStatus.Open;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedByEmail { get; set; }
        public string? AssignedToEmail { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
