using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwapIt.Application.Features.Admin;
using SwapIt.Application.Features.Admin.Categories;
using SwapIt.Application.Features.Admin.Provinces;
using SwapIt.Application.Common.Services;

namespace SwapIt.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "ADMIN")]
public class AdminController(ISender sender) : ControllerBase
{
    [HttpGet("profile")]
    public async Task<ActionResult<AdminProfileDto>> GetProfile()
    {
        return await sender.Send(new GetAdminProfileQuery());
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetStats()
    {
        return await sender.Send(new GetDashboardStatsQuery());
    }

    [HttpGet("items")]
    public async Task<ActionResult<List<ItemAdminDto>>> GetItems()
    {
        return await sender.Send(new GetAdminItemsQuery());
    }

    [HttpPut("name")]
    public async Task<ActionResult> UpdateName([FromBody] UpdateAdminNameCommand command)
    {
        // Update non-sensitive profile information
        await sender.Send(command);
        return NoContent();
    }

    [HttpPut("password")]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordCommand command)
    {
        // Change password requiring current password verification
        await sender.Send(command);
        return NoContent();
    }

    [HttpGet("diagnostics")]
    public async Task<ActionResult<DiagnosticsDto>> GetDiagnostics()
    {
        // Execute system health check
        return await sender.Send(new RunDiagnosticsQuery());
    }

    [HttpGet("maintenance")]
    [AllowAnonymous] // Allow anyone to check maintenance status
    public ActionResult<bool> GetMaintenanceStatus([FromServices] ISystemSettings settings)
    {
        return settings.MaintenanceMode;
    }

    [HttpPost("maintenance")]
    public ActionResult ToggleMaintenance([FromBody] bool enabled, [FromServices] ISystemSettings settings)
    {
        // Globally toggle maintenance mode
        settings.MaintenanceMode = enabled;
        return NoContent();
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<UserAdminDto>>> GetUsers()
    {
        return await sender.Send(new GetUsersQuery());
    }

    [HttpGet("trades")]
    public async Task<ActionResult<List<TradeAdminDto>>> GetTrades()
    {
        return await sender.Send(new GetTradesQuery());
    }

    [HttpGet("disputes")]
    public async Task<ActionResult<List<DisputeAdminDto>>> GetDisputes()
    {
        return await sender.Send(new GetDisputesQuery());
    }

    [HttpGet("offers")]
    public async Task<ActionResult<List<OfferAdminDto>>> GetOffers()
    {
        return await sender.Send(new GetOffersQuery());
    }

    // --- Marketplace Taxonomy ---

    [HttpGet("categories")]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories()
    {
        return await sender.Send(new GetCategoriesQuery());
    }

    [HttpPost("categories")]
    public async Task<ActionResult<string>> CreateCategory([FromBody] CreateCategoryCommand command)
    {
        return await sender.Send(command);
    }

    [HttpGet("provinces")]
    public async Task<ActionResult<List<ProvinceDto>>> GetProvinces()
    {
        return await sender.Send(new GetProvincesQuery());
    }
}
