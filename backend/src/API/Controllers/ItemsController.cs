using MediatR;
using Microsoft.AspNetCore.Mvc;
using SwapIt.Application.Features.Items.Queries.GetItems;
using SwapIt.Application.Features.Items.Commands;

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

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new SwapIt.Application.Features.Items.Queries.GetItemById.GetItemByIdQuery(id), cancellationToken);
        if (result is null) return NotFound(new { message = "Item not found" });
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateItemCommand command, CancellationToken cancellationToken)
    {
        var result = await mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
    {
        await mediator.Send(new DeleteItemCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateItemCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id) return BadRequest("ID mismatch");
        await mediator.Send(command, cancellationToken);
        return NoContent();
    }
}


