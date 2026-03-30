using FluentValidation;

namespace SwapIt.Application.Features.Notifications.Commands.MarkNotificationRead;

public sealed class MarkNotificationReadCommandValidator : AbstractValidator<MarkNotificationReadCommand>
{
    public MarkNotificationReadCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty().MinimumLength(5).MaximumLength(64);
        RuleFor(x => x.Id).NotEmpty().MinimumLength(5).MaximumLength(64);
    }
}
