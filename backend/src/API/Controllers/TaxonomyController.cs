using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwapIt.Application.Features.Admin.Categories;
using SwapIt.Application.Features.Admin.Provinces;
using SwapIt.Application.Features.Taxonomy;

namespace SwapIt.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaxonomyController(ISender sender) : ControllerBase
{
    [HttpGet("categories")]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories()
    {
        return await sender.Send(new GetCategoriesQuery());
    }

    [HttpGet("provinces")]
    public async Task<ActionResult<List<ProvinceDto>>> GetProvinces()
    {
        return await sender.Send(new GetProvincesQuery());
    }

    [HttpPost("suggestions")]
    [Authorize]
    public async Task<ActionResult> CreateSuggestion([FromBody] CreateSuggestionCommand command)
    {
        await sender.Send(command);
        return Ok();
    }
}
