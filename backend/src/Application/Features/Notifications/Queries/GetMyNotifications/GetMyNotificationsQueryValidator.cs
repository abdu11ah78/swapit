using FluentValidation;

namespace SwapIt.Application.Features.Notifications.Queries.GetMyNotifications;

public sealed class GetMyNotificationsQueryValidator : AbstractValidator<GetMyNotificationsQuery>
{
    public GetMyNotificationsQueryValidator()
    {
        RuleFor(x => x.UserId).NotEmpty().MinimumLength(5).MaximumLength(64);
    }
}
