using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AlRaneem.Website.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserRoleController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _context;

        public UserRoleController(IUnitOfWork unitOfWork, IHttpContextAccessor context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        //[Authorize(Policy = "AdminOnly")]
        [Authorize(Policy = "NotRegistered")]
        [HttpGet("AllUsers")]
        public async Task<IActionResult> getAllUsers()
        {
            var result = await _unitOfWork.userRoleRepo.GetAllUsersAsync2();
            _unitOfWork.Complete();
            return Ok(result);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost()]
        public async Task<IActionResult> AddUserRole([FromBody] UserRole userRole)
        {
            _unitOfWork.userRoleRepo.AddUserRole(userRole);
            _unitOfWork.Complete();
            return Ok();
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("Update")]
        public async Task<IActionResult> UpdateUserRole([FromBody] UserRole userRole)
        {
            _unitOfWork.userRoleRepo.UpdateUserRoleAsync(userRole);
            _unitOfWork.Complete();
            return Ok();
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("Delete")]
        public async Task<IActionResult> DeleteUserRole([FromBody] UserRole userRole)
        {
            _unitOfWork.userRoleRepo.DeleteUserRole(userRole);
            _unitOfWork.Complete();
            return Ok();
        }

        //[Authorize(Policy = "AdminOnly")]
        [Authorize(Policy = "NotRegistered")]
        [HttpGet()]
        public async Task<IActionResult> getAllUsersRoles()
        {
            var result = await _unitOfWork.userRoleRepo.GetAllUsersRolesAsync();
            _unitOfWork.Complete();
            return Ok(result);
        }

        [Authorize(Policy = "NotRegistered")]
        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser()
        {
            var userRole = _unitOfWork.userRoleRepo
            .FindUserRoleByConditionAsync(x => x.UserEmail == (_context.HttpContext.User.FindFirst(ClaimTypes.Email).Value ?? ""))
            .Result;
            _unitOfWork.Complete();
            return Ok(userRole);
        }
    }
}
