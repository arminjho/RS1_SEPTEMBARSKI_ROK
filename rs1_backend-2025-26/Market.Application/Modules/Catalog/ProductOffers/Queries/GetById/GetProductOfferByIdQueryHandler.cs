using Market.Application.Modules.Catalog.ProductOffers.Queries.GetById;

namespace Market.Application.Modules.Catalog.ProductOffers.Queries.GetById;

public class GetProductOfferByIdQueryHandler(IAppDbContext context) : IRequestHandler<GetProductOfferByIdQuery, GetProductOfferByIdQueryDto>
{
    public async Task<GetProductOfferByIdQueryDto> Handle(GetProductOfferByIdQuery request, CancellationToken cancellationToken)
    {
        var q = context.ProductOffers
            .Where(c => c.Id == request.Id);

        var dto = await q
            .Select(x => new GetProductOfferByIdQueryDto
            {
                Id = x.Id,
                Code = x.Code,
                ProductId = x.Product.Id,
                DiscountPercent = x.DiscountPercent,
                ValidUntilUtc = x.ValidUntilUtc,
                IsEnabled = x.IsEnabled,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (dto == null)
        {
            throw new MarketNotFoundException($"Offer with Id {request.Id} not found.");
        }

        return dto;
    }
}