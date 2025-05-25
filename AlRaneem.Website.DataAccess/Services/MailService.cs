using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models;
using Azure.Identity;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Graph.Models;

namespace AlRaneem.Website.DataAccess.Services
{
    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;
        public MailService(IOptions<MailSettings> mailSettings)
        {
            _mailSettings = mailSettings.Value;
        }

        public async Task SendEmailAsync(MailContext mail)
        {
            var credential = new ClientSecretCredential(_mailSettings.tenantId, _mailSettings.clientId, _mailSettings.clientSecret);
            var graphClient = new GraphServiceClient(credential);

            await graphClient.Users[_mailSettings.MailSender].SendMail.PostAsync(new Microsoft.Graph.Users.Item.SendMail.SendMailPostRequestBody
            {
                Message = new Message
                {
                    Subject = mail.Subject,
                    Body = new ItemBody
                    {
                        ContentType = BodyType.Text,
                        Content = mail.Body
                    },
                    ToRecipients = mail.ToEmail.Select(x => new Recipient
                    {
                        EmailAddress = new EmailAddress
                        {
                            Address = x
                        }
                    }).ToList()
                },
                SaveToSentItems = true
            });
        }
    }
}
