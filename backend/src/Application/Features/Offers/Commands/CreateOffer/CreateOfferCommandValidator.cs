using FluentValidation;

namespace SwapIt.Application.Features.Offers.Commands.CreateOffer;

public sealed class CreateOfferCommandValidator : AbstractValidator<CreateOfferCommand>
{
    public CreateOfferCommandValidator()
    {
        RuleFor(x => x.TradeId).NotEmpty().MinimumLength(5).MaximumLength(64);
        RuleFor(x => x.OfferedLtp).GreaterThanOrEqualTo(0);
        RuleFor(x => x.OfferedItemId).MaximumLength(64);
        RuleFor(x => x.Message).MaximumLength(300);
        RuleFor(x => x.ParentOfferId).MaximumLength(64);
        RuleForEach(x => x.OfferedItemIds).NotEmpty().MinimumLength(5).MaximumLength(64);
        RuleFor(x => x.ExpiresAt)
            .Must(x => !x.HasValue || x.Value > DateTime.UtcNow)
            .WithMessage("ExpiresAt must be in the future.");
    }
}
