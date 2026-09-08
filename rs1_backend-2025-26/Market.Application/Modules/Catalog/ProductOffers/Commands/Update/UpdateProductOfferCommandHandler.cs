using Market.Application.Abstractions.Caching;
using Market.Application.Modules.Catalog.ProductOffers.Commands.Update;

namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Update;

public sealed class UpdateProductOfferCommandHandler(
    IAppDbContext ctx,
    ICatalogCacheVersionService cacheVersionService) : IRequestHandler<UpdateProductOfferCommand, Unit>
{
    public async Task<Unit> Handle(UpdateProductOfferCommand request, CancellationToken ct)
    {
        var entity = await ctx.ProductOffers
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(ct);

        if (entity is null)
            throw new MarketNotFoundException($"Product (ID={request.Id}) nije pronađena.");

        // Check for duplicate name (case-insensitive, except for the same ID)
        var exists = await ctx.ProductOffers
            .AnyAsync(x => x.Id != request.Id && x.Code.ToLower() == request.Code.ToLower(), ct);

        if (exists)
        {
            throw new MarketConflictException("Code already exists.");
        }

        var product = await ctx.Products
          .Where(x => x.Id == request.ProductId)
          .FirstOrDefaultAsync(ct);

        if (product is null)
        {
            throw new MarketNotFoundException("ProductCategory", request.ProductId);
        }

        

        entity.Code = request.Code.Trim();
        entity.ProductId = request.ProductId;
        entity.DiscountPercent = request.DiscountPercent;
        entity.ValidUntilUtc = request.ValidUntilUtc;
        entity.IsEnabled = request.IsEnabled;


        await ctx.SaveChangesAsync(ct);

        // Invalidate catalog cache
        await cacheVersionService.BumpVersionAsync(ct);

        return Unit.Value;
    }
}
