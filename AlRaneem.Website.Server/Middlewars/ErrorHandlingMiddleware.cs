using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text.Json;

namespace AlRaneem.Website.Server.Middlewars
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            HttpStatusCode code = exception switch
            {
                ArgumentNullException => HttpStatusCode.BadRequest,
                UnauthorizedAccessException => HttpStatusCode.Unauthorized,
                KeyNotFoundException => HttpStatusCode.NotFound,
                DbUpdateException => HttpStatusCode.NotAcceptable,
                _ => HttpStatusCode.InternalServerError
            };

            string message = exception switch
            {
                DbUpdateException => exception.InnerException?.Message.Contains("UNIQUE") == true ||
                        exception.InnerException?.Message.Contains("IX_") == true ?
                        "Email already exists." : exception.Message,
                _ => exception.Message
            };

            var problemDetails = new ProblemDetails
            {
                Status = (int)code,
                Title = "An unexpected error occurred.",
                Detail = message
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = problemDetails.Status.Value;

            return context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails));
        }

    }
}
