using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AlRaneem.Website.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TicketHistoryController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _context;


        public TicketHistoryController(IUnitOfWork unitOfWork, IHttpContextAccessor context)
        {
            _unitOfWork = unitOfWork;
            _context = context;

        }

        [HttpGet("ticket/{ticketId}")]
        public async Task<IActionResult> GetTicketHistoryByTicketId(int ticketId)
        {
            var ticketHistory = await _unitOfWork.ticketHistoryRepo.GetTicketHistoryByTicketIdAsync(ticketId);
            return Ok(ticketHistory);
        }

        [HttpPost("saveHistory")]
        public async Task<IActionResult> SaveHistory([FromBody] TicketHistory ticketHistory)
        {
            if (ticketHistory == null || ticketHistory.HistoryDetails == null || !ticketHistory.HistoryDetails.Any())
                return BadRequest("Ticket history cannot be empty");

            var clientEmail = _context.HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(clientEmail))
                return Unauthorized("User email not found");

            var userObj = await _unitOfWork.userRoleRepo.FindUserRoleByConditionAsync(x => x.UserEmail == clientEmail);
            if (userObj == null)
                return NotFound("User not found");

            ticketHistory.CreatedAt = DateTime.UtcNow;
            ticketHistory.CreatedById = userObj.Id;

            await _unitOfWork.ticketHistoryRepo.SaveHistoryAsync(ticketHistory);
            _unitOfWork.Complete();

            return Ok(ticketHistory);
        }


    }
}
