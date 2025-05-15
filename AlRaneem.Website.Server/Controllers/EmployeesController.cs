using AlRaneem.Website.DataAccess.Enums;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AlRaneem.Website.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;

        public TicketsController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicketById(int id)
        {
            var ticket = await _unitOfWork.ticketRepo.GetByIdAsync(id);
            if (ticket == null)
                return NotFound("Ticket not found.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (ticket.AssignedToId != userId)
                return Forbid("You are not authorized to view this ticket.");

            return Ok(ticket);
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateTicket([FromBody] Ticket updatedTicket)
        {
            if (updatedTicket == null ||
          string.IsNullOrWhiteSpace(updatedTicket.Title) ||
          updatedTicket.Category == null ||
          string.IsNullOrWhiteSpace(updatedTicket.Category.Name) ||
          updatedTicket.Priority == TicketPriority.Undefined)
            {
                return BadRequest("Required fields are missing.");
            }


            var ticket = await _unitOfWork.ticketRepo.GetByIdAsync(updatedTicket.Id);
            if (ticket == null)
                return NotFound("Ticket not found.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (ticket.AssignedToId != userId)
                return Forbid("You are not authorized to edit this ticket.");

            ticket.Title = updatedTicket.Title;
            ticket.Category = updatedTicket.Category;
            ticket.Subcategory = updatedTicket.Subcategory;
            ticket.Priority = updatedTicket.Priority;
            ticket.Status = updatedTicket.Status;
            ticket.Description = updatedTicket.Description;

            await _unitOfWork.ticketRepo.UpdateAsync(ticket);
            await _unitOfWork.CompleteAsync();

            return Ok("Ticket updated successfully.");
        }

        [HttpGet("dropdown-data")]
        public async Task<IActionResult> GetDropdownData()
        {
            try
            {
                var categories = await _unitOfWork.ticketRepo.GetCategoriesAsync();
                var subcategories = await _unitOfWork.ticketRepo.GetSubcategoriesAsync();
                var priorities = await _unitOfWork.ticketRepo.GetPrioritiesAsync();
                var statuses = await _unitOfWork.ticketRepo.GetStatusesAsync();

                return Ok(new
                {
                    Categories = categories,
                    Subcategories = subcategories,
                    Priorities = priorities,
                    Statuses = statuses
                });
            }
            catch (Exception ex)
            {
                return Problem($"Failed to fetch dropdown data: {ex.Message}");
            }
        }
    }
}
