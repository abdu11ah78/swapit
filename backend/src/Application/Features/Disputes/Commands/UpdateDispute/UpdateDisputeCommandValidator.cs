using FluentValidation;

namespace SwapIt.Application.Features.Disputes.Commands.UpdateDispute;

public sealed class UpdateDisputeCommandValidator : AbstractValidator<UpdateDisputeCommand>
{
    public UpdateDisputeCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty().MinimumLength(5).MaximumLength(64);
        RuleFor(x => x.DisputeId).NotEmpty().MinimumLength(5).MaximumLength(64);
        RuleFor(x => x.Status)
            .NotEmpty()
            .Must(x => x is "UNDER_REVIEW" or "RESOLVED" or "REJECTED")
            .WithMessage("Status must be one of: UNDER_REVIEW, RESOLVED, REJECTED.");
        RuleFor(x => x.Resolution).MaximumLength(1000);
    }
}
