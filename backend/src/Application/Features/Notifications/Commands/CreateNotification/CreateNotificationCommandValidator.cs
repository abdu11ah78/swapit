using FluentValidation;

namespace SwapIt.Application.Features.Notifications.Commands.CreateNotification;

public sealed class CreateNotificationCommandValidator : AbstractValidator<CreateNotificationCommand>
{
    public CreateNotificationCommandValidator()
    {
        RuleFor(x => x.ActorUserId).NotEmpty().MinimumLength(5).MaximumLength(64);
        RuleFor(x => x.UserId).NotEmpty().MinimumLength(5).MaximumLength(64);
        RuleFor(x => x.Type)
            .NotEmpty()
            .Must(type => type is "INFO" or "NEW_MESSAGE" or "OFFER_RECEIVED" or "OFFER_UPDATED" or "OFFER_ACCEPTED" or "OFFER_REJECTED" or "TRADE_UPDATE" or "SMART_MATCH" or "DISPUTE_UPDATE")
            .WithMessage("Invalid notification type.");
        RuleFor(x => x.Message).NotEmpty().MinimumLength(3).MaximumLength(500);
    }
}
