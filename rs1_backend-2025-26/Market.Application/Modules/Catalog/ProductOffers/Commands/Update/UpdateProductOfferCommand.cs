namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Update;

public sealed class UpdateProductOfferCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }
    public required string Code { get; set; }
    public required int ProductId { get; set; }
    public required decimal DiscountPercent { get; set; }
    public required DateTime ValidUntilUtc { get; set; }
    public required bool IsEnabled { get; set; }
}
