using AlRaneem.Website.DataAccess.Extensions;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.Shared.DataContract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlRaneem.Website.Server.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class TicketController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;

        public TicketController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpPost("create")]
        public async Task<IActionResult> Create(CreateTicketDto createTicketDto)
        {
            try
            {
                var result = await _unitOfWork.ticketRepo.AddAsync(createTicketDto.ToModel(UserId));
                _unitOfWork.Complete();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return UnprocessableEntity(ex.Message);
            }
        }
    }
}
