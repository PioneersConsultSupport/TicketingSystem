using AlRaneem.Website.DataAccess;
using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Models;
using AlRaneem.Website.Server;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Data;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.AddDataAccessRegistration();

//builder.Services.AddAuthentication().AddBearerToken(IdentityConstants.BearerScheme);

//builder.Services.AddAuthentication()
//    .AddBearerToken(IdentityConstants.BearerScheme, options =>
//    {
//        options.BearerTokenExpiration = TimeSpan.FromDays(7); // Set expiry to 7 days
//    });

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://login.microsoftonline.com/4b8957b1-49be-40b7-9537-63e78101460d/v2.0";
        options.Audience = "api://fa035b9e-666c-4a68-99fe-eb806283d482"; // or use app URI if you set one
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true
        };
    });

builder.Services.AddAuthorization();

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
    var context = services.GetRequiredService<ApplicationDbContext>();
    await context.Database.MigrateAsync();
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
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();
app.UseMiddleware<ResponseTransformationMiddleware>();
app.MapIdentityApi<ApplicationUser>();
app.MapFallbackToFile("/index.html");

app.Run();
