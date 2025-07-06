using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    [HttpGet("login")]
    public IActionResult Login()
    {
        return Challenge(new AuthenticationProperties
        {
            RedirectUri = Url.Action("Complete", "Auth"),
        }, OpenIdConnectDefaults.AuthenticationScheme);
    }

    [HttpGet("Complete")]
    public async Task<IActionResult> Complete([FromQuery] string token)
    {
        var html = $@"
        <html>
          <body>
            <script>
              window.opener.postMessage({{ token: '{token}' }}, '*');
              window.close();
            </script>
          </body>
        </html>";

        return Content(html, "text/html");
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return SignOut(OpenIdConnectDefaults.AuthenticationScheme);
    }
}