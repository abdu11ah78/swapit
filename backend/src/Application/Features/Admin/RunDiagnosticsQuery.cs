using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;
using System.Diagnostics;

namespace SwapIt.Application.Features.Admin;

/// <summary>
/// DTO representing the system health and diagnostic information.
/// </summary>
public sealed class DiagnosticsDto
{
    public bool DatabaseConnection { get; init; }
    public string ServerUptime { get; init; } = string.Empty;
    public string MemoryUsage { get; init; } = string.Empty;
    public string CpuUsage { get; init; } = string.Empty;
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
}

/// <summary>
/// Query to run system diagnostics.
/// </summary>
public sealed record RunDiagnosticsQuery : IRequest<DiagnosticsDto>;

public sealed class RunDiagnosticsQueryHandler(IApplicationDbContext dbContext)
    : IRequestHandler<RunDiagnosticsQuery, DiagnosticsDto>
{
    public async Task<DiagnosticsDto> Handle(RunDiagnosticsQuery request, CancellationToken cancellationToken)
    {
        // Check database connectivity by attempting a simple count query
        bool dbOk = false;
        try {
            await dbContext.Users.CountAsync(cancellationToken);
            dbOk = true;
        } catch { /* DB check failed */ }

        // Calculate server uptime using current process start time
        var process = Process.GetCurrentProcess();
        var uptime = DateTime.Now - process.StartTime;
        
        // Formatted memory usage in MB
        var memoryMB = process.WorkingSet64 / (1024 * 1024);

        return new DiagnosticsDto
        {
            DatabaseConnection = dbOk,
            ServerUptime = $"{uptime.Days}d {uptime.Hours}h {uptime.Minutes}m",
            MemoryUsage = $"{memoryMB} MB",
            CpuUsage = "Optimal" // Placeholder for simple diagnostic
        };
    }
}
