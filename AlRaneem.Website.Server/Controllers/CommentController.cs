using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AlRaneem.Website.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CommentController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _context;


        public CommentController(IUnitOfWork unitOfWork ,IHttpContextAccessor context)
        {
            _unitOfWork = unitOfWork;
            _context = context;

        }

        [HttpGet("ticket/{ticketId}")]
        public async Task<IActionResult> GetCommentsByTicketId(int ticketId)
        {
            var comments = await _unitOfWork.commentRepo.GetCommentsByTicketIdAsync(ticketId);
            return Ok(comments);
        }

        [HttpPost("sendComment")]
        public async Task<IActionResult> AddComment([FromBody] Comment comment)
        {
            if (comment == null || string.IsNullOrWhiteSpace(comment.Message))
                return BadRequest("Message cannot be empty");


            var clientEmail = _context.HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
            var userObj = await _unitOfWork.userRoleRepo.FindUserRoleByConditionAsync(x => x.UserEmail == clientEmail);
            comment.CreatedAt = DateTime.UtcNow;
            comment.CreatedById = userObj.Id;
            await _unitOfWork.commentRepo.AddAsync(comment);
            _unitOfWork.Complete();
            return Ok(comment);
        }
    }
}
