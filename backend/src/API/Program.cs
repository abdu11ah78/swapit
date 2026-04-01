using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SwapIt.API.Common.Middleware;
using SwapIt.API.Common.Services;
using SwapIt.Application;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "SwapIt.API";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "SwapIt.Client";
var jwtKey = builder.Configuration["Jwt:Key"] ?? "REPLACE_ME_WITH_A_SECURE_MIN_32_CHAR_KEY";

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // Seed database
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();
    await context.SeedAsync();
}

app.UseApiExceptionHandling();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
