namespace SwapIt.Application.Common.Services;

/// <summary>
/// Singleton service to manage global system settings like Maintenance Mode.
/// </summary>
public interface ISystemSettings
{
    bool MaintenanceMode { get; set; }
}

public class SystemSettings : ISystemSettings
{
    // Global flag for maintenance mode (volatile, resets on restart but functional for this task)
    public bool MaintenanceMode { get; set; } = false;
}
