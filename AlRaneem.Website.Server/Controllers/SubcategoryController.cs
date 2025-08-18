using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlRaneem.Website.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SubcategoryController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;

        public SubcategoryController(IUnitOfWork unitOfWork, IHttpContextAccessor context)
        {
            _unitOfWork = unitOfWork;
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost()]
        public async Task<IActionResult> AddSubcategory([FromBody] Subcategory subcategory)
        {
            _unitOfWork.subcategoryRepo.AddSubcategory(subcategory);
            _unitOfWork.Complete();
            return Ok();
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("Update")]
        public async Task<IActionResult> UpdateSubcategory([FromBody] Subcategory subcategory)
        {
            _unitOfWork.subcategoryRepo.UpdateSubcategory(subcategory);
            _unitOfWork.Complete();
            return Ok();
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteSubcategory(int id)
        {
            var subcategory = await _unitOfWork.subcategoryRepo.GetSubcategoryByIdAsync(id);
            if (subcategory == null)
            {
                return NotFound(new { message = $"Subcategory with Id {id} not found." });
            }

            _unitOfWork.subcategoryRepo.DeleteSubcategory(subcategory);
            _unitOfWork.Complete();

            return Ok(new { message = "Subcategory deleted successfully." });
        }


    }
}
