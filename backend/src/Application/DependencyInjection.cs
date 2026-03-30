using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using SwapIt.Application.Common.Behaviors;
using SwapIt.Application.Mappings;

namespace SwapIt.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = typeof(DependencyInjection).Assembly;
        services.AddMediatR(config => config.RegisterServicesFromAssembly(assembly));
        services.AddValidatorsFromAssembly(assembly);
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        MapsterConfig.RegisterMappings();
        return services;
    }
}
