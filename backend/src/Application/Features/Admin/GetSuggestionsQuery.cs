using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Admin;

public record SuggestionDto(string Id, string Type, string Name, string UserName, bool IsApproved, DateTime CreatedAt);

public record GetSuggestionsQuery : IRequest<List<SuggestionDto>>;

public class GetSuggestionsQueryHandler(IApplicationDbContext dbContext) : IRequestHandler<GetSuggestionsQuery, List<SuggestionDto>>
{
    public async Task<List<SuggestionDto>> Handle(GetSuggestionsQuery request, CancellationToken cancellationToken)
    {
        return await dbContext.Suggestions
            .Include(s => s.User)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new SuggestionDto(
                s.Id,
                s.Type,
                s.Name,
                s.User.Name ?? s.User.Email,
                s.IsApproved,
                s.CreatedAt
            ))
            .ToListAsync(cancellationToken);
    }
}
