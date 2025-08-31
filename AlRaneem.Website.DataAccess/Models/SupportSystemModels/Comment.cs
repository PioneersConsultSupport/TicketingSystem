namespace AlRaneem.Website.DataAccess.Models.SupportSystemModels
{
    public class Comment
    {
        public int Id { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int TicketId { get; set; }
        public Ticket? Ticket { get; set; }
        public int CreatedById { get; set; }
        public UserRole? CreatedBy { get; set; }
    }

}
