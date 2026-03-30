using FluentValidation;

namespace SwapIt.Application.Features.Reviews.Commands.SubmitReview;

public sealed class SubmitReviewCommandValidator : AbstractValidator<SubmitReviewCommand>
{
    public SubmitReviewCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty().MinimumLength(5).MaximumLength(64);
        RuleFor(x => x.TradeId).NotEmpty().MinimumLength(5).MaximumLength(64);
        RuleFor(x => x.TargetId).NotEmpty().MinimumLength(5).MaximumLength(64);
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
        RuleFor(x => x.Comment).MaximumLength(1000);
    }
}
