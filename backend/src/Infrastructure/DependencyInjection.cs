using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Infrastructure.Auth;
using SwapIt.Infrastructure.Persistence;

namespace SwapIt.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Server=DESKTOP-O2OTSGA\\SQLEXPRESS;Database=SwapItDb;Trusted_Connection=True;TrustServerCertificate=True;";

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString));
        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<ITokenService, TokenService>();

        return services;
    }
}
