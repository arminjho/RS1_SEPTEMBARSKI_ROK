using Market.Application.Abstractions.Caching;

namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Delete;

public class DeleteProductOfferCommandHandler(
    IAppDbContext context,
    IAppCurrentUser appCurrentUser,
    ICatalogCacheVersionService cacheVersionService) : IRequestHandler<DeleteProductOfferCommand, Unit>
{
    public async Task<Unit> Handle(DeleteProductOfferCommand request, CancellationToken cancellationToken)
    {
        if (!appCurrentUser.IsAdmin)
            throw new MarketBusinessRuleException("123", "Samo admin moze brisati.");

        var offer = await context.ProductOffers
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (offer is null)
            throw new MarketNotFoundException("offer nije pronađen.");

        if (offer.IsDeleted)
            throw new MarketNotFoundException("offer je vec izbrisan.");

        if (offer.IsEnabled)
            throw new MarketNotFoundException("offer je ukljucen i aktivan i ne moze se obrisati.. .");

        offer.IsDeleted = true;
        await context.SaveChangesAsync(cancellationToken);

        // Invalidate catalog cache
        await cacheVersionService.BumpVersionAsync(cancellationToken);

        return Unit.Value;
    }
}
