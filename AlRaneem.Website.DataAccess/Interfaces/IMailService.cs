using AlRaneem.Website.DataAccess.Models;

namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface IMailService
    {
        Task SendEmailAsync(MailContext mail);
    }
}
