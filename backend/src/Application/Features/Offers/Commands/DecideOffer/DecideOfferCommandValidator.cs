using FluentValidation;

namespace SwapIt.Application.Features.Offers.Commands.DecideOffer;

public sealed class DecideOfferCommandValidator : AbstractValidator<DecideOfferCommand>
{
    public DecideOfferCommandValidator()
    {
        RuleFor(x => x.OfferId).NotEmpty().MinimumLength(5).MaximumLength(64);
        RuleFor(x => x.Action)
            .NotEmpty()
            .Must(action => action is "ACCEPT" or "REJECT" or "COUNTER")
            .WithMessage("Action must be one of: ACCEPT, REJECT, COUNTER.");
    }
}
