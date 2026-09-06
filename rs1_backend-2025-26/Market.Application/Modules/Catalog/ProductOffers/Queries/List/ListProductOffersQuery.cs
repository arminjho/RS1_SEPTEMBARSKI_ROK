namespace Market.Application.Modules.Catalog.ProductOffers.Queries.List;

public sealed class ListProductOffersQuery : BasePagedQuery<ListProductOffersQueryDto>
{
    public int? ProductId { get; init; }
    public bool? IsEnabled { get; init; } = false;
}
