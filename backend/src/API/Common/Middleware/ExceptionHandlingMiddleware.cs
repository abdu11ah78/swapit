using FluentValidation;
using SwapIt.Application.Common.Exceptions;

namespace SwapIt.API.Common.Middleware;

public sealed class ExceptionHandlingMiddleware(RequestDelegate next)
{
    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (ValidationException ex)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsJsonAsync(new
            {
                message = "Invalid payload",
                issues = ex.Errors.Select(e => new { field = e.PropertyName, error = e.ErrorMessage })
            });
        }
        catch (AppException ex)
        {
            context.Response.StatusCode = ex.StatusCode;
            await context.Response.WriteAsJsonAsync(new { message = ex.Message });
        }
        catch
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsJsonAsync(new { message = "Internal server error" });
        }
    }
}
