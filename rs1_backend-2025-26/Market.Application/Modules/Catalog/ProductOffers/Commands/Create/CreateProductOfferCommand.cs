namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Create;

public class CreateProductOfferCommand : IRequest<int>
{
        public  required string Code { get; set; }
        public required int ProductId { get; set; }
        public required decimal DiscountPercent { get; set; }
        public required DateTime ValidUntilUtc { get; set; }

   
}