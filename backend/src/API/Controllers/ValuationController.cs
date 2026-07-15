using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.API.Controllers;

/// <summary>
/// Valuation controller — proxies AI appraisal requests to the Python microservice
/// and returns structured pricing estimates.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public sealed class ValuationController(IAppraisalService appraisalService) : ControllerBase
{
    /// <summary>
    /// POST api/valuation/appraise
    /// Accepts item description, mileage, damage count (and optional anchor price)
    /// and returns an AI-computed market-value retention percentage + PKR estimate.
    /// </summary>
    [HttpPost("appraise")]
    [AllowAnonymous]
    public async Task<IActionResult> Appraise(
        [FromBody] AppraiseItemRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await appraisalService.AppraiseAsync(
            new AppraiseRequest(
                request.Description,
                request.Mileage,
                request.DamageCount,
                request.AnchorPricePkr),
            cancellationToken);

        return Ok(new
        {
            retentionPct      = result.RetentionPct,
            estimatedValuePkr = result.EstimatedValuePkr,
            anchorPricePkr    = result.AnchorPricePkr,
            confidence        = result.Confidence,
        });
    }

    /// <summary>
    /// GET api/valuation/health
    /// Quick ping to verify the AI microservice is reachable.
    /// </summary>
    [HttpGet("health")]
    [AllowAnonymous]
    public async Task<IActionResult> Health(CancellationToken cancellationToken)
    {
        try
        {
            // Probe the Python service health endpoint
            var result = await appraisalService.AppraiseAsync(
                new AppraiseRequest("health check test item", 0, 0),
                cancellationToken);
            return Ok(new { status = "ok", aiService = "reachable" });
        }
        catch
        {
            return StatusCode(503, new { status = "degraded", aiService = "unreachable" });
        }
    }
}

/// <summary>Request DTO accepted by the API layer.</summary>
public sealed record AppraiseItemRequest(
    string Description,
    double Mileage,
    int    DamageCount,
    double AnchorPricePkr = 238_500.0
);
