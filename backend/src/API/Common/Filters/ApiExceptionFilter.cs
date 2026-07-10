using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SwapIt.Application.Common.Exceptions;

namespace SwapIt.API.Common.Filters;

public sealed class ApiExceptionFilter : ExceptionFilterAttribute
{
    public override void OnException(ExceptionContext context)
    {
        if (context.Exception is AppException appEx)
        {
            context.Result = new ObjectResult(new { message = appEx.Message })
            {
                StatusCode = appEx.StatusCode
            };
            context.ExceptionHandled = true;
        }
        else if (context.Exception is FluentValidation.ValidationException valEx)
        {
            context.Result = new BadRequestObjectResult(new
            {
                message = "Invalid payload",
                issues = valEx.Errors.Select(e => new { field = e.PropertyName, error = e.ErrorMessage })
            });
            context.ExceptionHandled = true;
        }
    }
}
