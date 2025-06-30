using AlRaneem.Website.DataAccess;
using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Enums;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using AlRaneem.Website.DataAccess.Repsitories;
using AlRaneem.Website.Server.handlers;
using AlRaneem.Website.Server.Middlewars;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using AlRaneem.Website.DataAccess.Services;
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
builder.Services.AddScoped<IMailService, MailService>();

var azureAd = builder.Configuration
    .GetSection("AzureAd")
    .Get<AzureConfig>();

builder.Services.Configure<AzureConfig>(builder.Configuration.GetSection("AzureAd"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://login.microsoftonline.com/" + azureAd?.TenantId;
        options.Audience = "api://"+ azureAd?.ClientId;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true
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

builder.Services.AddIdentityCore<ApplicationUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddApiEndpoints();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
    await Seeder.Seed(services);
}
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
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseMiddleware<ErrorHandlingMiddleware>();
app.MapIdentityApi<ApplicationUser>();
app.MapFallbackToFile("/index.html");

app.Run();
