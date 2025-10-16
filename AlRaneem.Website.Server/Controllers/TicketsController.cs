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
    [Route("[controller]")]
    [ApiController]
    public class TicketController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _context;
        private readonly ITicketEmailService _ticketEmailService;


        public TicketController(
            IUnitOfWork unitOfWork,
            IHttpContextAccessor context,
            ITicketEmailService ticketEmailService)
        {
            _unitOfWork = unitOfWork;
            _context = context;
            _ticketEmailService = ticketEmailService;
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
            if (ticket == null) return BadRequest("Invalid ticket data");

            var clientEmail = _context.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value;
            var userObj = await _unitOfWork.userRoleRepo
                .FindUserRoleByConditionAsync(x => x.UserEmail == clientEmail);

            if (userObj == null) return Unauthorized();

            ticket.RefNumber = await GenerateRefNumber();
            ticket.CreatedById = userObj.Id;
            ticket.CreatedBy = userObj;

            await _unitOfWork.ticketRepo.AddAsync(ticket);
            _unitOfWork.Complete();

            await _ticketEmailService.SendTicketCreationEmails(ticket, userObj, clientEmail);

            return Ok(ticket);
        }


        [HttpPost("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Ticket ticket)
        {
            if (id != ticket.Id) return BadRequest("Ticket ID mismatch");

            var existing = await _unitOfWork.ticketRepo.GetByIdAsync(id);
            if (existing == null) return NotFound();

            var previousAssignedToId = existing.AssignedToId;
            var previousStatusId = existing.StatusId;

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
                await _ticketEmailService.SendTicketAssignmentEmail(existing);
            }

            // --- Email on ticket completion ---
            var completedStatusId = 24; 
            if (previousStatusId != completedStatusId && existing.StatusId == completedStatusId)
            {
                await _ticketEmailService.SendTicketCompletionEmail(existing);
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
