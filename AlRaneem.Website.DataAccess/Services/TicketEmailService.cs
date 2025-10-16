using AlRaneem.Website.DataAccess.Enums;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AlRaneem.Website.DataAccess.Services
{
    public class TicketEmailService : ITicketEmailService
    {
        private readonly IMailService _mailService;
        private readonly IUnitOfWork _unitOfWork;

        public TicketEmailService(IMailService mailService, IUnitOfWork unitOfWork)
        {
            _mailService = mailService;
            _unitOfWork = unitOfWork;
        }

        public async Task SendTicketCreationEmails(Ticket ticket, UserRole creator, string clientEmail)
        {
            // --- Email to Client ---
            if (!string.IsNullOrEmpty(clientEmail))
            {
                var emailTemplate = BuildTicketEmail(ticket, "Customer", TicketEmailType.Creation);
                var mailContext = new MailContext
                {
                    Subject = $"Your Ticket Has Been Created - {ticket.RefNumber}",
                    ToEmail = new[] { clientEmail },
                    Body = emailTemplate
                };
                _ = _mailService.SendEmailAsync(mailContext);
            }

            // --- Email to Support Managers ---
            var supportManagers = await _unitOfWork.userRoleRepo
                .GetUserRoleByRoleAsync((int)UserRoles.SupportManager);

            if (supportManagers.Any())
            {
                var supportEmailTemplate = BuildTicketEmail(ticket, "Support Manager", TicketEmailType.ManagerNotification, creator.UserEmail);
                var mailContext = new MailContext
                {
                    Subject = $"New Ticket Created - {ticket.RefNumber}",
                    ToEmail = supportManagers.Select(x => x.UserEmail).ToArray(),
                    Body = supportEmailTemplate
                };
                _ = _mailService.SendEmailAsync(mailContext);
            }

            // --- Email to Assigned Employee ---
            if (ticket.AssignedToId != null)
            {
                await SendTicketAssignmentEmail(ticket);
            }
        }


        public async Task SendTicketAssignmentEmail(Ticket ticket)
        {
            if (ticket.AssignedToId == null) return;

            var assignedUser = await _unitOfWork.userRoleRepo
                .FindUserRoleByConditionAsync(x => x.Id == ticket.AssignedToId);

            if (assignedUser == null || string.IsNullOrEmpty(assignedUser.UserEmail)) return;

            var employeeEmailTemplate = BuildTicketEmail(ticket, assignedUser.UserName, TicketEmailType.Assignment);
            var mailContext = new MailContext
            {
                Subject = $"New Ticket Assigned to You - {ticket.RefNumber}",
                ToEmail = new[] { assignedUser.UserEmail },
                Body = employeeEmailTemplate
            };

            _ = _mailService.SendEmailAsync(mailContext);
        }


        public async Task SendTicketCompletionEmail(Ticket ticket)
        {
            if (!ticket.CreatedById.HasValue) return;

            var createdUser = await _unitOfWork.userRoleRepo
                .FindUserRoleByConditionAsync(x => x.Id == ticket.CreatedById.Value);

            if (createdUser == null || string.IsNullOrEmpty(createdUser.UserEmail)) return;

            var emailTemplate = BuildTicketEmail(ticket, "Customer", TicketEmailType.Completion);
            var mailContext = new MailContext
            {
                Subject = $"Ticket Completed - {ticket.RefNumber}",
                ToEmail = new[] { createdUser.UserEmail },
                Body = emailTemplate
            };

            _ = _mailService.SendEmailAsync(mailContext);
        }


        private string BuildTicketEmail(Ticket ticket, string recipientName, TicketEmailType type, string creatorEmail = null)
        {
            string greeting = $"Dear {recipientName},";

            string intro = type switch
            {
                TicketEmailType.Creation => "Your request has been successfully received and a new ticket has been created.",
                TicketEmailType.Assignment => "A new ticket has been assigned to you.",
                TicketEmailType.Completion => "Your ticket has been successfully completed.",
                TicketEmailType.ManagerNotification => "A new ticket has been created by a customer.",
                _ => ""
            };

            string followUpText = type switch
            {
                TicketEmailType.Creation => "Our support team will follow up on your ticket and contact you shortly.",
                TicketEmailType.Assignment => "Please follow up on the ticket and take the necessary actions.",
                TicketEmailType.ManagerNotification => "Please review the ticket and take the necessary action.",
                TicketEmailType.Completion => "Your ticket has been completed. You can review the results and provide feedback if necessary.",
                _ => ""
            };

            string createdByLine = type == TicketEmailType.ManagerNotification && !string.IsNullOrEmpty(creatorEmail)
                ? $"<li><b>Created By:</b> {creatorEmail}</li>"
                : "";

            string datesHtml = (type != TicketEmailType.Creation && type != TicketEmailType.Completion)
                ? $@"
        <li><b>Start Date:</b> {ticket.StartDate?.ToString("dd/MM/yyyy") ?? "N/A"}</li>
        <li><b>Delivery Date:</b> {ticket.DeliveryDate?.ToString("dd/MM/yyyy") ?? "N/A"}</li>"
                : "";

            string bodyContent = $@"
<p>{greeting}</p>
<p>{intro}</p>
<h2>Ticket Details</h2>
<ul class='ticket-details'>
    <li><b>Reference Number:</b> {ticket.RefNumber}</li>
    <li><b>Title:</b> {ticket.Title}</li>
    <li><b>Description:</b> {ticket.Description}</li>
    {createdByLine}
    {datesHtml}
</ul>
<p>{followUpText}</p>
<p>Best regards,<br/>Support Team</p>";

            (string color, string icon) = type switch
            {
                TicketEmailType.Creation => ("#008593", "🆕"),
                TicketEmailType.Assignment => ("#0073e6", "📌"),
                TicketEmailType.Completion => ("#28a745", "✅"),
                TicketEmailType.ManagerNotification => ("#dc3545", "⚠️"),
                _ => ("#ffc107", "ℹ️")
            };

            return EmailTemplate.GetHtml(bodyContent, color, icon);
        }

    }
}
