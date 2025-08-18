using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Enums;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using AlRaneem.Website.DataAccess.Repsitories;
using AlRaneem.Website.DataAccess.Services;
using AlRaneem.Website.Server.classes;
using AlRaneem.Website.Server.handlers;
using AlRaneem.Website.Server.interfaces;
using AlRaneem.Website.Server.Middlewars;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

string connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlite(connectionString));
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddScoped(typeof(IBaseRepo<,>), typeof(BaseRepo<,>));
builder.Services.AddTransient<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IEmployeeRepo, EmployeeRepo>();
builder.Services.AddScoped<IUserRoleRepo, UserRoleRepo>();
builder.Services.AddScoped<ITicketRepo, TicketRepo>();
builder.Services.AddScoped<ICommentRepo, CommentRepo>();
builder.Services.AddScoped<ILookupRepo, LookupRepo>();
builder.Services.AddScoped<ICategoryRepo, CategoryRepo>();
builder.Services.AddScoped<ISubcategoryRepo, SubcategoryRepo>();
builder.Services.AddScoped<IMailService, MailService>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

var azureAd = builder.Configuration
    .GetSection("AzureAd")
    .Get<AzureConfig>();

builder.Services.Configure<AzureConfig>(builder.Configuration.GetSection("AzureAd"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        ValidateIssuerSigningKey = true,
    };
})
.AddOpenIdConnect(options =>
{
    options.Authority = $"https://login.microsoftonline.com/{azureAd?.TenantId}/v2.0";
    options.ClientId = azureAd?.ClientId;
    options.ClientSecret = azureAd?.ClientIdValue;
    options.ResponseType = "code";
    options.SaveTokens = true;
    options.GetClaimsFromUserInfoEndpoint = true;
    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("email");
    options.CallbackPath = "/signin-oidc";
    options.CorrelationCookie.SameSite = SameSiteMode.None;
    options.NonceCookie.SameSite = SameSiteMode.None;
    options.CorrelationCookie.SecurePolicy = CookieSecurePolicy.Always;
    options.NonceCookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Events = new OpenIdConnectEvents
    {
        OnTokenValidated = async ctx =>
        {
            var jwtHandler = ctx.HttpContext.RequestServices.GetRequiredService<IJwtTokenGenerator>();

            var jwt = jwtHandler.GenerateToken(ctx.Principal);
            var redirectUrl = $"{builder.Configuration["Jwt:Issuer"]}/auth/Complete?token={jwt}";

            ctx.Response.Redirect(redirectUrl);
            ctx.HandleResponse();
        }
    };
});

builder.Services.AddScoped<IAuthorizationHandler, RoleAuthorizationHandler>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.Requirements.Add(new RoleRequirement(UserRoles.Admin)));
    options.AddPolicy("NotRegistered", policy =>
        policy.Requirements.Add(new RoleRequirement(UserRoles.NotRegistered)));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseCors("AllowAll");
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCookiePolicy();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseMiddleware<ErrorHandlingMiddleware>();
app.MapFallbackToFile("/index.html");


// need to find a way to run this only once, maybe in a separate project or as a console app
//using (var scope = app.Services.CreateScope())
//{
//    var services = scope.ServiceProvider;
//    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
//    db.Database.Migrate();
//    await Seeder.Seed(services);
//}

app.Run();