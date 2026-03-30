using FluentValidation;

namespace SwapIt.Application.Features.Trades.Commands.CreateTrade;

public sealed class CreateTradeCommandValidator : AbstractValidator<CreateTradeCommand>
{
    public CreateTradeCommandValidator()
    {
        RuleFor(x => x.ItemId).NotEmpty().MinimumLength(5).MaximumLength(64);
        RuleFor(x => x.SellerId).NotEmpty().MinimumLength(5).MaximumLength(64);
    }
}
