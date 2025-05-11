using AlRaneem.Website.DataAccess.Extensions;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.Shared.DataContract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlRaneem.Website.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class CourseController : BaseController
    {
        private readonly IUnitOfWork unitOfWork;

        public CourseController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        [HttpPost("create")]
        public async Task<IActionResult> Create(CreateTicketDto createTicketDto)
        {
            try
            {
                var result = await unitOfWork.ticketRepo.AddAsync(createTicketDto.ToModel(UserId));
                unitOfWork.Complete();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return UnprocessableEntity(ex.Message);
            }
        }
    }
}
