namespace Market.Application.Modules.Catalog.ProductOffers.Queries.List;

public sealed class ListProductOffersQueryDto
{
    public required int Id { get; init; }

    public required string Code { get; set; }
    public required string ProductName { get; set; }

    public decimal Price { get; set; }
    public decimal DiscountPercent { get; set; }
    public decimal DiscountedPrice { get; set; }

    public DateTime ValidUntilUtc { get; set; }
    public ProductOfferStateType? Status { get; init; }

}
