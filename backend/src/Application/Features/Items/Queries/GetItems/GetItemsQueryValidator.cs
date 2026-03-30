using FluentValidation;

namespace SwapIt.Application.Features.Items.Queries.GetItems;

public sealed class GetItemsQueryValidator : AbstractValidator<GetItemsQuery>
{
    public GetItemsQueryValidator()
    {
        RuleFor(x => x.Q).MaximumLength(200);
        RuleFor(x => x.Category).MaximumLength(100);
        RuleFor(x => x.Location).MaximumLength(200);
        RuleFor(x => x.Sort)
            .Must(sort => sort is "latest" or "value" or "relevance")
            .WithMessage("Sort must be one of: latest, value, relevance.");
    }
}
