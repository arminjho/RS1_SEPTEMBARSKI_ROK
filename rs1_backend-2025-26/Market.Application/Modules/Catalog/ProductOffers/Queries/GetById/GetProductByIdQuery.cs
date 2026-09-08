namespace Market.Application.Modules.Catalog.ProductOffers.Queries.GetById;

public class GetProductOfferByIdQuery : IRequest<GetProductOfferByIdQueryDto>
{
    public int Id { get; set; }
}