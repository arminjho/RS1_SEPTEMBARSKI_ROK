using Market.Application.Modules.Catalog.Products.Queries.List;

namespace Market.Application.Modules.Catalog.ProductOffers.Queries.List;

public sealed class ListProductOffersQueryHandler(IAppDbContext ctx)
        : IRequestHandler<ListProductOffersQuery, PageResult<ListProductOffersQueryDto>>
{
    public async Task<PageResult<ListProductOffersQueryDto>> Handle(
        ListProductOffersQuery request, CancellationToken ct)
    {
        var q = ctx.ProductOffers.AsNoTracking();

        var today = DateTime.UtcNow.Date;   

        if (request.ProductId != null)
        {
            q = q.Where(x => x.ProductId == request.ProductId);
        }

        if (request.IsEnabled==true)
        {
            q = q.Where(x => x.IsEnabled ==true);
        }

        var projectedQuery = q.OrderBy(x => x.Code)
            .Select(x => new ListProductOffersQueryDto
            {
                Id = x.Id,
                Code = x.Code,
                ProductName = x.Product.Name,
                DiscountedPrice = Math.Round(x.Product.Price * (1 - x.DiscountPercent / 100), 2),
                DiscountPercent = x.DiscountPercent,
                Price = x.Product.Price,
                Status=x.IsEnabled==false ? ProductOfferStateType.Iskljucena : x.ValidUntilUtc < today ? ProductOfferStateType.Istekla : ProductOfferStateType.Aktivna,
                ValidUntilUtc=x.ValidUntilUtc,
            });

        return await PageResult<ListProductOffersQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }


}
