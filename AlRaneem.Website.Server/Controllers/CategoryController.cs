using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlRaneem.Website.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CategoryController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("AllCategory")]
        public async Task<IActionResult> getAllCategory()
        {
            var result = await _unitOfWork.categoryRepo.GetAllCategoryAsync();
            _unitOfWork.Complete();
            return Ok(result);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost()]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            _unitOfWork.categoryRepo.AddCategory(category);
            _unitOfWork.Complete();
            return Ok();
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("Update")]
        public async Task<IActionResult> UpdateCategory([FromBody] Category category)
        {
            _unitOfWork.categoryRepo.UpdateCategory(category);
            _unitOfWork.Complete();
            return Ok();
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _unitOfWork.categoryRepo.GetCategoryByIdAsync(id);

            if (category == null)
            {
                return NotFound(new { message = $"Category with Id {id} not found." });
            }

            return Ok(category);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _unitOfWork.categoryRepo.GetCategoryByIdAsync(id);
            if (category == null)
            {
                return NotFound(new { message = $"Category with Id {id} not found." });
            }

            _unitOfWork.categoryRepo.DeleteCategory(category);
            _unitOfWork.Complete();

            return Ok(new { message = "Category deleted successfully." });
        }

    }
}
