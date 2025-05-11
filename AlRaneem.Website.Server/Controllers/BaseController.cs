using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AlRaneem.Website.Server.Controllers
{
    public class BaseController : ControllerBase
    {
        public string? UserId
        {
            get
            {
                return HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            }
        }
    }
}
