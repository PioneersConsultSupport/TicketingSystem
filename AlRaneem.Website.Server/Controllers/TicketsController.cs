using AlRaneem.Website.DataAccess.Enums;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Security.Claims;

namespace AlRaneem.Website.Server.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class TicketController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _context;
        private readonly IMailService _mailService;

        public TicketController(
            IUnitOfWork unitOfWork,
            IHttpContextAccessor context,
            IMailService mailService)
        {
            _unitOfWork = unitOfWork;
            _context = context;
            _mailService = mailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var includes = new string[]
            {
            "Priority", "Status", "Category", "Subcategory", "AssignedTo", "CreatedBy"
            };

            var tickets = await _unitOfWork.ticketRepo.GetAllAsync(includes);
            return Ok(tickets);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ticket = await _unitOfWork.ticketRepo.GetByIdAsync(id);
            if (ticket == null) return NotFound();
            return Ok(ticket);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Ticket ticket)
        {
            try
            {
                if (ticket == null) return BadRequest("Invalid ticket data");

                // Current user
                var clientEmail = _context.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value;
                var userObj = await _unitOfWork.userRoleRepo
                    .FindUserRoleByConditionAsync(x => x.UserEmail == clientEmail);

                ticket.RefNumber = await GenerateRefNumber();
                ticket.CreatedById = userObj.Id;
                ticket.CreatedBy = userObj;

                await _unitOfWork.ticketRepo.AddAsync(ticket);
                _unitOfWork.Complete();

                // --- Email to Client ---
                if (!string.IsNullOrEmpty(clientEmail))
                {
                    var clientBody = $@"
<p>Dear Customer,</p>
<p>Your request has been successfully received and a new ticket has been created in our Help Center system.</p>
<h2>Ticket Details</h2>
<ul>
    <li><b>Reference Number:</b> {ticket.RefNumber}</li>
    <li><b>Title:</b> {ticket.Title}</li>
    <li><b>Description:</b> {ticket.Description}</li>
</ul>
<p>Our support team will follow up on your ticket and contact you shortly.</p>
<p>Best regards,<br/>Support Team</p>";

                    var mailContextForClient = new MailContext
                    {
                        Subject = $"Your Ticket Has Been Created - {ticket.RefNumber}",
                        ToEmail = new[] { clientEmail },
                        Body = EmailTemplate.GetHtml(clientBody)
                    };
                    await _mailService.SendEmailAsync(mailContextForClient);
                }

                // --- Email to Support Managers ---
                var supportManagers = await _unitOfWork.userRoleRepo
                    .GetUserRoleByRoleAsync((int)UserRoles.SupportManager);

                if (supportManagers.Any())
                {
                    var supportBody = $@"
<p>Dear Support Manager,</p>
<p>A new ticket has been created by a customer.</p>
<h2>Ticket Details</h2>
<ul>
    <li><b>Reference Number:</b> {ticket.RefNumber}</li>
    <li><b>Title:</b> {ticket.Title}</li>
    <li><b>Description:</b> {ticket.Description}</li>
    <li><b>Created By:</b> {userObj.UserEmail}</li>
</ul>
<p>Please review the ticket and take the necessary action.</p>
<p>Best regards,<br/>Support Team</p>";

                    var mailContextForSupportManager = new MailContext
                    {
                        Subject = $"New Ticket Created - {ticket.RefNumber}",
                        ToEmail = supportManagers.Select(x => x.UserEmail).ToArray(),
                        Body = EmailTemplate.GetHtml(supportBody)
                    };
                    await _mailService.SendEmailAsync(mailContextForSupportManager);
                }

                // --- Email to Assigned Employee ---
                if (ticket.AssignedToId != null)
                {
                    var assignedUser = await _unitOfWork.userRoleRepo
                        .FindUserRoleByConditionAsync(x => x.Id == ticket.AssignedToId);

                    if (assignedUser != null && !string.IsNullOrEmpty(assignedUser.UserEmail))
                    {
                        var employeeBody = $@"
<p>Dear {assignedUser.UserName},</p>
<p>A new ticket has been assigned to you.</p>
<h2>Ticket Details</h2>
<ul>
    <li><b>Reference Number:</b> {ticket.RefNumber}</li>
    <li><b>Title:</b> {ticket.Title}</li>
    <li><b>Description:</b> {ticket.Description}</li>
    <li><b>Start Date:</b> {ticket.StartDate?.ToString("dd/MM/yyyy")}</li>
    <li><b>Delivery Date:</b> {ticket.DeliveryDate?.ToString("dd/MM/yyyy")}</li>
</ul>
<p>Please follow up on the ticket and take the necessary actions.</p>
<p>Best regards,<br/>Support Team</p>";

                        var mailContextForEmployee = new MailContext
                        {
                            Subject = $"New Ticket Assigned to You - {ticket.RefNumber}",
                            ToEmail = new[] { assignedUser.UserEmail },
                            Body = EmailTemplate.GetHtml(employeeBody)
                        };
                        await _mailService.SendEmailAsync(mailContextForEmployee);
                    }
                }

                return Ok(ticket);
            }
            catch (Exception ex)
            {
                return UnprocessableEntity(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Ticket ticket)
        {
            if (id != ticket.Id) return BadRequest("Ticket ID mismatch");

            var existing = await _unitOfWork.ticketRepo.GetByIdAsync(id);
            if (existing == null) return NotFound();

            var previousAssignedToId = existing.AssignedToId;

            existing.Title = ticket.Title;
            existing.Description = ticket.Description;
            existing.PriorityId = ticket.PriorityId;
            existing.StatusId = ticket.StatusId;
            existing.CategoryId = ticket.CategoryId;
            existing.SubcategoryId = ticket.SubcategoryId;
            existing.StartDate = ticket.StartDate;
            existing.DeliveryDate = ticket.DeliveryDate;
            existing.AssignedToId = ticket.AssignedToId;
            existing.SupportOptionId = ticket.SupportOptionId;

            _unitOfWork.ticketRepo.Update(existing);
            _unitOfWork.Complete();

            // --- Email to newly assigned Employee ---
            if (existing.AssignedToId != null && existing.AssignedToId != previousAssignedToId)
            {
                var assignedUser = await _unitOfWork.userRoleRepo
                    .FindUserRoleByConditionAsync(x => x.Id == existing.AssignedToId);

                if (assignedUser != null && !string.IsNullOrEmpty(assignedUser.UserEmail))
                {
                    var employeeBody = $@"
<p>Dear {assignedUser.UserName},</p>
<p>A new ticket has been assigned to you.</p>
<h2>Ticket Details</h2>
<ul>
    <li><b>Reference Number:</b> {ticket.RefNumber}</li>
    <li><b>Title:</b> {ticket.Title}</li>
    <li><b>Description:</b> {ticket.Description}</li>
    <li><b>Start Date:</b> {ticket.StartDate?.ToString("dd/MM/yyyy")}</li>
    <li><b>Delivery Date:</b> {ticket.DeliveryDate?.ToString("dd/MM/yyyy")}</li>
</ul>
<p>Please follow up on the ticket and take the necessary actions.</p>
<p>Best regards,<br/>Support Team</p>";

                    var mailContextForEmployee = new MailContext
                    {
                        Subject = $"New Ticket Assigned to You - {ticket.RefNumber}",
                        ToEmail = new[] { assignedUser.UserEmail },
                        Body = EmailTemplate.GetHtml(employeeBody)
                    };
                    await _mailService.SendEmailAsync(mailContextForEmployee);
                }
            }

            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ticket = await _unitOfWork.ticketRepo.GetByIdAsync(id);
            if (ticket == null) return NotFound();

            _unitOfWork.ticketRepo.Delete(ticket);
            _unitOfWork.Complete();
            return NoContent();
        }

        [HttpGet("myTickets")]
        public async Task<IActionResult> GetMyTickets()
        {
            var userEmail = _context.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail)) return Unauthorized();

            var currentUser = await _unitOfWork.userRoleRepo
                .FindUserRoleByConditionAsync(x => x.UserEmail == userEmail);

            if (currentUser == null) return Unauthorized();

            var includes = new string[]
            {
            "Priority", "Status", "Category", "Subcategory", "AssignedTo", "CreatedBy"
            };

            var tickets = await _unitOfWork.ticketRepo.FindAllAsync(
                t => t.CreatedById == currentUser.Id || t.AssignedToId == currentUser.Id,
                includes
            );

            return Ok(tickets);
        }

        private async Task<string> GenerateRefNumber()
        {
            var lastTicket = await _unitOfWork.ticketRepo.GetLastTicketAsync();
            int nextNumber = 1;

            if (lastTicket != null && !string.IsNullOrEmpty(lastTicket.RefNumber))
            {
                var parts = lastTicket.RefNumber.Split('_');
                if (parts.Length == 2 && int.TryParse(parts[1], out int lastNumber))
                    nextNumber = lastNumber + 1;
            }
            return $"#RF_{nextNumber:D4}";
        }
    }

}
