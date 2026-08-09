using MediatR;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Core.Entities;

namespace SwapIt.Application.Features.Taxonomy;

public record CreateSuggestionCommand(string Type, string Name) : IRequest;

public class CreateSuggestionCommandHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService) : IRequestHandler<CreateSuggestionCommand>
{
    public async Task Handle(CreateSuggestionCommand request, CancellationToken cancellationToken)
    {
        var suggestion = new Suggestion(
            Guid.NewGuid().ToString("N"),
            request.Type,
            request.Name,
            currentUserService.UserId!
        );

        dbContext.Suggestions.Add(suggestion);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
