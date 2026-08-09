using MediatR;
using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Application.Features.Admin.Provinces;

public record ProvinceDto(string Id, string Name, bool IsActive);

public record GetProvincesQuery : IRequest<List<ProvinceDto>>;

public class GetProvincesQueryHandler(IApplicationDbContext dbContext) : IRequestHandler<GetProvincesQuery, List<ProvinceDto>>
{
    public async Task<List<ProvinceDto>> Handle(GetProvincesQuery request, CancellationToken cancellationToken)
    {
        return await dbContext.Provinces
            .Select(p => new ProvinceDto(p.Id, p.Name, p.IsActive))
            .ToListAsync(cancellationToken);
    }
}
