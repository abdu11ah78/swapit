namespace SwapIt.Application.Common.Interfaces;

/// <summary>
/// Proxy interface to forward appraisal requests to the Python AI microservice.
/// </summary>
public interface IAppraisalService
{
    /// <summary>
    /// Request an AI-based market-value appraisal.
    /// </summary>
    Task<AppraisalResult> AppraiseAsync(AppraiseRequest request, CancellationToken cancellationToken = default);
}

/// <summary>Input contract for the appraisal endpoint.</summary>
public sealed record AppraiseRequest(
    string Description,
    double Mileage,
    int DamageCount,
    double AnchorPricePkr = 238_500.0
);

/// <summary>Output returned by the Python microservice, forwarded to the client.</summary>
public sealed record AppraisalResult(
    double RetentionPct,
    double EstimatedValuePkr,
    double AnchorPricePkr,
    string Confidence
);
