
namespace AlRaneem.Website.DataAccess.Models
{
    public class MailContext
    {
        public MailContext() { }

        public MailContext(string[]? toEmail, string subject, string body)
        {
            this.ToEmail = toEmail;
            this.Subject = subject;
            this.Body = body;
        }

        public string[]? ToEmail { get; set; }
        public string? Subject { get; set; }
        public string? Body { get; set; }
    }
}
