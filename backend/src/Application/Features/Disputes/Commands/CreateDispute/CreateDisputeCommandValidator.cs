using FluentValidation;

namespace SwapIt.Application.Features.Disputes.Commands.CreateDispute;

public sealed class CreateDisputeCommandValidator : AbstractValidator<CreateDisputeCommand>
{
    public CreateDisputeCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty().MinimumLength(5).MaximumLength(64);
        RuleFor(x => x.TradeId).NotEmpty().MinimumLength(5).MaximumLength(64);
        RuleFor(x => x.Reason).NotEmpty().MinimumLength(10).MaximumLength(500);
        RuleFor(x => x.Evidence).MaximumLength(5000);
    }
}
