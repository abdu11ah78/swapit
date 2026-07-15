using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Infrastructure.Services;

/// <summary>
/// HTTP proxy that forwards appraisal requests to the Python FastAPI microservice
/// running on http://localhost:8000/api/v1/appraise.
/// </summary>
public sealed class AppraisalService(
    IHttpClientFactory httpClientFactory,
    ILogger<AppraisalService> logger) : IAppraisalService
{
    private const string ClientName = "SwapItAI";

    public async Task<AppraisalResult> AppraiseAsync(
        AppraiseRequest request,
        CancellationToken cancellationToken = default)
    {
        var client = httpClientFactory.CreateClient(ClientName);

        var payload = new PythonAppraiseRequest(
            request.Description,
            request.Mileage,
            request.DamageCount,
            request.AnchorPricePkr);

        logger.LogInformation(
            "Forwarding appraisal request to AI service | description={Desc} mileage={M} damage={D}",
            request.Description[..Math.Min(40, request.Description.Length)],
            request.Mileage,
            request.DamageCount);

        var response = await client
            .PostAsJsonAsync("/api/v1/appraise", payload, cancellationToken)
            .ConfigureAwait(false);

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            logger.LogError("AI service returned {Status}: {Body}", response.StatusCode, body);
            throw new InvalidOperationException(
                $"AI appraisal service failed ({response.StatusCode}): {body}");
        }

        var result = await response.Content
            .ReadFromJsonAsync<PythonAppraiseResponse>(cancellationToken: cancellationToken)
            .ConfigureAwait(false)
            ?? throw new InvalidOperationException("AI service returned an empty response.");

        logger.LogInformation(
            "Appraisal complete | retention={R}% | value={V:N0} PKR | confidence={C}",
            result.RetentionPct,
            result.EstimatedValuePkr,
            result.Confidence);

        return new AppraisalResult(
            result.RetentionPct,
            result.EstimatedValuePkr,
            result.AnchorPricePkr,
            result.Confidence);
    }

    // ── Internal DTOs matching the Python FastAPI schema (snake_case) ──────────

    private sealed record PythonAppraiseRequest(
        [property: JsonPropertyName("description")] string Description,
        [property: JsonPropertyName("mileage")]     double Mileage,
        [property: JsonPropertyName("damage_count")] int DamageCount,
        [property: JsonPropertyName("anchor_price_pkr")] double AnchorPricePkr);

    private sealed record PythonAppraiseResponse(
        [property: JsonPropertyName("retention_pct")]       double RetentionPct,
        [property: JsonPropertyName("estimated_value_pkr")] double EstimatedValuePkr,
        [property: JsonPropertyName("anchor_price_pkr")]    double AnchorPricePkr,
        [property: JsonPropertyName("confidence")]          string Confidence);
}
