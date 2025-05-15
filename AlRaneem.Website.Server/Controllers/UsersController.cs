using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph.Models;

namespace AlRaneem.Website.Server.Controllers
{
    [Authorize(Policy = "AdminOnly")]
    [Route("[controller]")]
    [ApiController]
    public class UserRoleController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserRoleController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("AllUsers")]
        public async Task<IActionResult> getAllUsers()
        {
            var result = await _unitOfWork.userRoleRepo.GetAllUsersAsync();
            _unitOfWork.Complete();
            return Ok(result);
        }

        [HttpPost()]
        public async Task<IActionResult> AddUserRole([FromBody] UserRole userRole)
        {
            _unitOfWork.userRoleRepo.AddUserRole(userRole);
            _unitOfWork.Complete();
            return Ok();
        }

        [HttpPut()]
        public async Task<IActionResult> UpdateUserRole([FromBody] UserRole userRole)
        {
           _unitOfWork.userRoleRepo.UpdateUserRole(userRole);
           _unitOfWork.Complete();
           return Ok();
        }

        [HttpPost("Delete")]
        public async Task<IActionResult> DeleteUserRole([FromBody] UserRole userRole)
        {
           _unitOfWork.userRoleRepo.DeleteUserRole(userRole);
           _unitOfWork.Complete();
           return Ok();
        }

        [HttpGet()]
        public async Task<IActionResult> getAllUsersRoles()
        {
           var result = await _unitOfWork.userRoleRepo.GetAllUsersRolesAsync();
           _unitOfWork.Complete();
           return Ok(result);
        }
    }
}
