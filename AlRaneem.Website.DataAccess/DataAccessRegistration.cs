using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Repsitories;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AlRaneem.Website.DataAccess
{
    public static class DataAccessRegistration
    {


        public static void AddDataAccessRegistration(this WebApplicationBuilder builder)
        {
            string connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));
            builder.Services.AddScoped(typeof(IBaseRepo<,>), typeof(BaseRepo<,>));
            builder.Services.AddTransient<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IEmployeeRepo, EmployeeRepo>();
            builder.Services.AddScoped<IUserRepo, UserRepo>();
            builder.Services.AddScoped<ITicketRepo, TicketRepo>();
            builder.Services.AddScoped<ICommentRepo, CommentRepo>();
            builder.Services.AddScoped<ICategoryRepo, CategoryRepo>();
        }

        //private static void AddSmsService(WebApplicationBuilder builder)
        //{

        //    SmsConfiguration? smsConfiguration = builder.Configuration.GetSection("SmsConfiguration").Get<SmsConfiguration>();
        //    if (smsConfiguration != null)
        //    {
        //        switch (smsConfiguration.EnabledServiceName)
        //        {
        //            case "TwilioSmsService":

        //                builder.Services.Configure<TwilioConfiguration>(builder.Configuration.GetSection("SmsConfiguration:TwilioConfiguration"));
        //                builder.Services.AddSingleton<ISmsService, TwilioSmsService>();
        //                break;
        //            case "SmsMockService":
        //                builder.Services.AddSingleton<ISmsService, SmsMockService>();
        //                break;
        //            default:
        //                builder.Services.AddSingleton<ISmsService, SmsMockService>();
        //                break;
        //        }
        //    }
        //}
    }
}