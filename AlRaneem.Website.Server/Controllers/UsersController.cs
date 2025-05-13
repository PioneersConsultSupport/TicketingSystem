using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph.Models;

namespace AlRaneem.Website.Server.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class UserController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        
        [HttpGet()]
        public async Task<IActionResult> getAllUsers()
        {
            try
            {
                var result = await _unitOfWork.userRoleRepo.GetAllUsersAsync();
                _unitOfWork.Complete();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return UnprocessableEntity(ex.Message);
            }
        }

        [HttpPost()]
        public async Task<IActionResult> AddUserRole([FromBody] UserRole userRole)
        {
            try
            {
                _unitOfWork.userRoleRepo.AddUserRole(userRole);
                _unitOfWork.Complete();
                return Ok();
            }
            catch (Exception ex)
            {
                return UnprocessableEntity(ex.Message);
            }
        }
    }
}
