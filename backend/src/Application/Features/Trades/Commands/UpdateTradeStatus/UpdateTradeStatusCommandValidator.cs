using FluentValidation;

namespace SwapIt.Application.Features.Trades.Commands.UpdateTradeStatus;

public sealed class UpdateTradeStatusCommandValidator : AbstractValidator<UpdateTradeStatusCommand>
{
    public UpdateTradeStatusCommandValidator()
    {
        RuleFor(x => x.TradeId).NotEmpty().MinimumLength(5).MaximumLength(64);
        RuleFor(x => x.Status)
            .NotEmpty()
            .Must(s => s is "PENDING" or "ACCEPTED" or "IN_PROGRESS" or "COMPLETED" or "DISPUTED" or "CANCELLED")
            .WithMessage("Status must be one of: PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, DISPUTED, CANCELLED.");
        RuleFor(x => x.Note).MaximumLength(300);
    }
}
