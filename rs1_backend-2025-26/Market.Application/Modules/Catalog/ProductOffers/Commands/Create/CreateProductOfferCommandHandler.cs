using Market.Application.Abstractions.Caching;
using Market.Application.Modules.Catalog.Products.Commands.Create;

namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Create;

public class CreateProductOfferCommandHandler(
    IAppDbContext ctx,
    ICatalogCacheVersionService cacheVersionService) : IRequestHandler<CreateProductOfferCommand, int>
{
    public async Task<int> Handle(CreateProductOfferCommand request, CancellationToken ct)
    {
        var normalized = request.Code?.Trim();

        if (string.IsNullOrWhiteSpace(normalized))
            throw new ValidationException("Code is required.");

        // Check if a product with the same name already exists.
        bool exists = await ctx.ProductOffers
            .AnyAsync(x => x.Code == normalized, ct);

        if (exists)
        {
            throw new MarketConflictException("Code already exists.");
        }

        var product = await ctx.Products
            .Where(x => x.Id == request.ProductId)
            .FirstOrDefaultAsync(ct);

        if (product is null && product.IsDeleted)
        {
            throw new MarketNotFoundException("Product", request.ProductId);
        }

        if (product.IsEnabled == false)
        {
            throw new MarketConflictException($"Category {product.Name} is disabled.");
        }
        if (request.DiscountPercent == null && request.DiscountPercent < 0 && request.DiscountPercent > 0)
        {
            throw new MarketBusinessRuleException($"409","popust obavezan");
        }


        var offer = new ProductOfferEntity
        {
            Code = normalized,
            ProductId = request.ProductId,
            DiscountPercent = request.DiscountPercent,
            ValidUntilUtc = request.ValidUntilUtc,
        };

        ctx.ProductOffers.Add(offer);
        await ctx.SaveChangesAsync(ct);

        // Invalidate catalog cache
        await cacheVersionService.BumpVersionAsync(ct);

        return offer.Id;
    }
}
