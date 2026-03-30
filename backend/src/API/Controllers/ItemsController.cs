using MediatR;
using Microsoft.AspNetCore.Mvc;
using SwapIt.Application.Features.Items.Queries.GetItems;

namespace SwapIt.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ItemsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] string? q,
        [FromQuery] string? category,
        [FromQuery] string? location,
        [FromQuery] string? sort,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetItemsQuery(q, category, location, sort ?? "latest"), cancellationToken);
        return Ok(result);
    }
}
