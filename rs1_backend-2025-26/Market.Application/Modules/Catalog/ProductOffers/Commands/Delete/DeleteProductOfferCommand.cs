namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Delete;

public class DeleteProductOfferCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
