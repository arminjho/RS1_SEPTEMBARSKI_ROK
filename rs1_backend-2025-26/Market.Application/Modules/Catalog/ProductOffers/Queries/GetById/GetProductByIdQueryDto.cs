namespace Market.Application.Modules.Catalog.ProductOffers.Queries.GetById;

public class GetProductOfferByIdQueryDto
{
    public required int Id { get; init; }

    public required string Code { get; set; }
    public required int ProductId { get; set; }

    public decimal Price { get; set; }
    public decimal DiscountPercent { get; set; }
    public decimal DiscountedPrice { get; set; }
    public bool IsEnabled { get; set; }

    public DateTime ValidUntilUtc { get; set; }
    public ProductOfferStateType? Status { get; init; }
}
