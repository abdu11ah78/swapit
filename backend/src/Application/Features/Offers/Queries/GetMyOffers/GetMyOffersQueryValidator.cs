using FluentValidation;

namespace SwapIt.Application.Features.Offers.Queries.GetMyOffers;

public sealed class GetMyOffersQueryValidator : AbstractValidator<GetMyOffersQuery>
{
    public GetMyOffersQueryValidator()
    {
        RuleFor(x => x.UserId).NotEmpty().MinimumLength(5).MaximumLength(64);
    }
}
