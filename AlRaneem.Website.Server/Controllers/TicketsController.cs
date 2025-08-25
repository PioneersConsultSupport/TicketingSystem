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
    [Authorize(Policy = "NotRegistered")]
    [Route("[controller]")]
    [ApiController]
    public class TicketController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _context;
        private readonly IMailService _mailService;

        public TicketController(IUnitOfWork unitOfWork, IHttpContextAccessor context, IMailService mailService)
        {
            _unitOfWork = unitOfWork;
            _context = context;
            _mailService = mailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var includes = new string[]{"Priority","Status","Category","Subcategory","AssignedTo","CreatedBy"};
            var tickets = await _unitOfWork.ticketRepo.GetAllAsync(includes);
            return Ok(tickets);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ticket = await _unitOfWork.ticketRepo.GetByIdAsync(id);
            if (ticket == null)
                return NotFound();

            return Ok(ticket);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Ticket ticket)
        {
            try
            {
                if (ticket == null)
                    return BadRequest("Invalid ticket data");

                // Client
                var clientEmail = _context.HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
                var userObj = _unitOfWork.userRoleRepo.FindUserRoleByConditionAsync(x => x.UserEmail == clientEmail).Result;

                ticket.RefNumber = await GenerateRefNumber();
                ticket.CreatedById = userObj.Id;
                ticket.CreatedBy = userObj;
                await _unitOfWork.ticketRepo.AddAsync(ticket);
                _unitOfWork.Complete();

                if (!string.IsNullOrEmpty(clientEmail))
                {
                    var mailContextForClient = new MailContext
                    {
                        Subject = "Ticket Created",
                        ToEmail = new[] { clientEmail },
                        Body = $"A new ticket has been added with Reference Number: {ticket.RefNumber}."
                    };
                    await _mailService.SendEmailAsync(mailContextForClient);
                }

                // Send email to Support Manager(s)
                var supportManagerEmailList = await _unitOfWork.userRoleRepo.GetUserRoleByRoleAsync((int)UserRoles.SupportManager);
                var emails = supportManagerEmailList.Select(x => x.UserEmail).ToArray();
                var testEmails = "L.alawneh@pioneersconsult.com";
                if (testEmails.Length > 0)
                {
                    var mailContextForSupportManager = new MailContext
                    {
                        Subject = "Ticket Created",
                        ToEmail = [testEmails],
                        Body = $"A new ticket has been added.\nRefNumber: {ticket.RefNumber}\nTitle: {ticket.Title}\nDescription: {ticket.Description}"
                    };
                    await _mailService.SendEmailAsync(mailContextForSupportManager);
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
            if (id != ticket.Id)
                return BadRequest("Ticket ID mismatch");

            var existing = await _unitOfWork.ticketRepo.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

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
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ticket = await _unitOfWork.ticketRepo.GetByIdAsync(id);
            if (ticket == null)
                return NotFound();

            _unitOfWork.ticketRepo.Delete(ticket);
            _unitOfWork.Complete();

            return NoContent();
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
