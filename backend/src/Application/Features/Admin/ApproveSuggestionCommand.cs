using MediatR;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Admin;

public record ApproveSuggestionCommand(string Id) : IRequest;

public class ApproveSuggestionCommandHandler(IApplicationDbContext dbContext) : IRequestHandler<ApproveSuggestionCommand>
{
    public async Task Handle(ApproveSuggestionCommand request, CancellationToken cancellationToken)
    {
        var suggestion = await dbContext.Suggestions.FindAsync([request.Id], cancellationToken);
        if (suggestion != null)
        {
            suggestion.IsApproved = true;
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
