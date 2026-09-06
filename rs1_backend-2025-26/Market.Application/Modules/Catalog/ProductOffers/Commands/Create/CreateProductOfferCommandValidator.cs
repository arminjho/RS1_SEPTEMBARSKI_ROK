using FluentValidation;

namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Create;

public sealed class CreateProductOfferCommandValidator : AbstractValidator<CreateProductOfferCommand>
{
    public CreateProductOfferCommandValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Code name is required.")
            .Length(5,20).WithMessage("Code name cannot exceed 200 characters.");

        

        RuleFor(x => x.DiscountPercent)
            .GreaterThan(0).WithMessage("Price must be greater than 0.");

        RuleFor(x => x.DiscountPercent)
            .InclusiveBetween(0.01m, 50m).WithMessage("Popust mora biti do 50%.")
            .Must(x => decimal.Round(x, 2) == x).WithMessage("Popust može imati najviše 2 decimale.");

        RuleFor(x => x.ProductId)
            .GreaterThan(0).WithMessage("Proizvod must be greater than 0.");

        RuleFor(x => x.ValidUntilUtc)
            .NotEmpty().WithMessage("Datum važenja je obavezan.");
    }
}
