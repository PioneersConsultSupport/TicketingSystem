using AlRaneem.Website.DataAccess.Enums;
using AlRaneem.Website.DataAccess.Extensions;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using AlRaneem.Website.DataAccess.Repsitories;
using AlRaneem.Website.Shared.DataContract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph.Models;
using System.Data;
using System.Linq.Expressions;

namespace AlRaneem.Website.Server.Controllers
{
    [Authorize(Policy = "NotRegistered")]
    [Route("[controller]")]
    [ApiController]
    public class TicketController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _context;
        private readonly IMailService _mailService;

        public TicketController(IUnitOfWork unitOfWork, IHttpContextAccessor context, IMailService mailService)
        {
            _unitOfWork = unitOfWork;
            _context = context;
            _mailService = mailService;
        }

        [HttpPost()]
        public async Task<IActionResult> Create([FromBody] TicketDto ticketDto)
        {
            try
            {
                var ticketEntity = new Ticket();
                ticketEntity = ticketDto.ToEntity();

                await _unitOfWork.ticketRepo.AddAsync(ticketEntity);
                _unitOfWork.Complete();

                var Entity = _unitOfWork.ticketRepo.Find(x => x.Id == ticketEntity.Id,
                    ["Status", "Category", "Subcategory", "Priority", "SupportType", "AssignedTo"]);

                var result = new
                {
                    Entity.Id,
                    Entity.Title,
                    Entity.Description,
                    Entity.CreatedById,
                    Status = Entity.Status?.Name,
                    Entity.StatusId,
                    Category = Entity.Category?.Name,
                    Entity.CategoryId,
                    subcategory = Entity.Subcategory?.Name,
                    Entity.SubcategoryId,
                    supportType = Entity.SupportType?.Name,
                    Entity.SupportTypeId,
                    Priority = Entity.Priority?.Name,
                    Entity.PriorityId,
                    AssignedTo = Entity.AssignedTo?.UserName != null ? Entity.AssignedTo.UserName : "Unassigned",
                    Entity.AssignedToId
                };

                MailContext mailContextForClient = new()
                {
                    Subject = "Teckit Created",
                    ToEmail = [_context?.HttpContext?.User?.Identity?.Name],
                    Body = $"A new ticket has been added with number {result.Id}."
                };

                await _mailService.SendEmailAsync(mailContextForClient);

                var supportManagerEmailList = _unitOfWork.userRoleRepo.GetUserRoleByRoleAsync((int)UserRoles.SupportManager)
                    .Result.Select(x => x.UserEmail).ToList();

                if (supportManagerEmailList is not null && supportManagerEmailList.Count > 0)
                {
                    MailContext mailContextForSupportManager = new()
                    {
                        Subject = "Teckit Created",
                        ToEmail = supportManagerEmailList.ToArray(),
                        Body = $"A new ticket has been added with number {result.Id}.\nTitle: {result.Title}.\nSupport Option: {result.supportType}." +
                        $"\nCategory: {result.Category}.\nSubcategory: {result.subcategory}.\nDescription: {result.Description}."
                    };

                    await _mailService.SendEmailAsync(mailContextForSupportManager);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return UnprocessableEntity(ex.Message);
            }
        }

        [HttpPut()]
        public async Task<IActionResult> Update([FromBody] TicketDto ticketDto)
        {
            try
            {
                var ticketEntity = new Ticket();
                ticketEntity = ticketDto.ToEntity();

                _unitOfWork.ticketRepo.Update(ticketEntity);
                _unitOfWork.Complete();

                var Entity = _unitOfWork.ticketRepo.Find(x => x.Id == ticketEntity.Id,
                    ["Status", "Category", "Subcategory", "Priority", "SupportType", "AssignedTo"]);

                var result = new
                {
                    Entity.Id,
                    Entity.Title,
                    Entity.Description,
                    Entity.CreatedById,
                    Status = Entity.Status?.Name,
                    Entity.StatusId,
                    Category = Entity.Category?.Name,
                    Entity.CategoryId,
                    subcategory = Entity.Subcategory?.Name,
                    Entity.SubcategoryId,
                    supportType = Entity.SupportType?.Name,
                    Entity.SupportTypeId,
                    Priority = Entity.Priority?.Name,
                    Entity.PriorityId,
                    AssignedTo = Entity.AssignedTo?.UserName != null ? Entity.AssignedTo.UserName : "Unassigned",
                    Entity.AssignedToId
                };

                var employeeEmail = _unitOfWork.userRoleRepo.FindUserRoleByConditionAsync(x => x.Id == Entity.AssignedToId)
                    .Result.UserEmail;

                MailContext mailContextForEmployee = new()
                {
                    Subject = "Teckit Assigned",
                    ToEmail = [employeeEmail],
                    Body = $"A new ticket has been assigned to you with number {result.Id}."
                };

                await _mailService.SendEmailAsync(mailContextForEmployee);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return UnprocessableEntity(ex.Message);
            }
        }

        [HttpPost("Delete")]
        public async Task<IActionResult> Delete([FromBody] TicketDto ticketDto)
        {
            try
            {
                var ticketEntity = new Ticket();
                ticketEntity = ticketDto.ToEntity();

                _unitOfWork.ticketRepo.Delete(ticketEntity);
                _unitOfWork.Complete();
                return Ok(true);
            }
            catch (Exception ex)
            {
                return UnprocessableEntity(ex.Message);
            }
        }

        [HttpGet()]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var userRoleByRole = _unitOfWork.userRoleRepo
                .GetUserRoleByRoleAsync((int)UserRoles.Employee)
                .Result;

                var userRole = _unitOfWork.userRoleRepo
                .FindUserRoleByConditionAsync(x => x.UserEmail == (_context.HttpContext.User.Identity.Name ?? ""))
                .Result;

                Expression<Func<Ticket, bool>> filter = userRole.UserRoleId switch
                {
                    (int)UserRoles.Client => x => x.CreatedById == userRole.Id,
                    (int)UserRoles.Employee => x => x.AssignedToId == userRole.Id,
                    _ => x => true
                };

                var ticketList = _unitOfWork.ticketRepo
                    .FindAllAsNoTrackingAsync(filter, ["Status", "Category", "Subcategory", "Priority", "SupportType", "AssignedTo"])
                    .Result
                    .Select(t => new
                    {
                        t.Id,
                        t.Title,
                        t.Description,
                        t.CreatedById,
                        Status = t.Status?.Name,
                        t.StatusId,
                        Category = t.Category?.Name,
                        t.CategoryId,
                        subcategory = t.Subcategory?.Name,
                        t.SubcategoryId,
                        supportType = t.SupportType?.Name,
                        t.SupportTypeId,
                        Priority = t.Priority?.Name,
                        t.PriorityId,
                        AssignedTo = t.AssignedTo?.UserName != null ? t.AssignedTo.UserName : "Unassigned",
                        t.AssignedToId
                    });

                var lookups = _unitOfWork.lookupRepo.GetAllLookupsAsync().Result.Select(t => new
                {
                    t.Id,
                    t.Type,
                    t.Name,
                    t.ParentId,
                    t.IsActive,
                    t.SortOrder
                });

                _unitOfWork.Complete();
                return Ok(new
                {
                    lookups = lookups,
                    ticketList = ticketList,
                    userRoleByRole = userRoleByRole,
                    userRole =
                    new
                    {
                        Id = userRole.Id,
                        UserRoleId = userRole.UserRoleId,
                        UserEmail = userRole.UserEmail,
                        UserName = userRole.UserName,
                    }
                });
            }
            catch (Exception ex)
            {
                return UnprocessableEntity(ex.Message);
            }
        }
    }
}
