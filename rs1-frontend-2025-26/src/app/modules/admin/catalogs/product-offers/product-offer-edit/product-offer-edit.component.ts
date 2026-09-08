import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../core/components/base-classes/base-form-component';
import { ExamProductLookupItem } from '../../../../../api-services/exam-products/exam-products-api.models';
import { ToasterService } from '../../../../../core/services/toaster.service';
import { ExamProductsApiService } from '../../../../../api-services/exam-products/exam-products-api.service';
import { ProductOffersApiService } from '../../../../../api-services/product-offers/product-offers-api.service';
import { forkJoin } from 'rxjs';
import { GetProductOfferByIdQueryDto } from '../../../../../api-services/product-offers/product-offers-api.models';

@Component({ selector: 'app-product-offer-edit', standalone: false, templateUrl: './product-offer-edit.component.html', styleUrl: '../product-offer-add/product-offer-add.component.scss' })
export class ProductOfferEditComponent extends BaseFormComponent<GetProductOfferByIdQueryDto>
  implements OnInit {

   private api = inject(ProductOffersApiService);
   private productsApi = inject(ExamProductsApiService);
   private formService = inject(FormBuilder);
   private router = inject(Router);
   private toaster = inject(ToasterService);
   private route = inject(ActivatedRoute);

  offerId!: number;
    products: ExamProductLookupItem[] = [];

  ngOnInit(): void {
    this.offerId = +this.route.snapshot.params['id'];
    this.initForm(true); // Edit mode
  }


  protected override initForm(isEdit:boolean): void {
    this.form = this.formService.group({
      code: ["", [Validators.required, Validators.minLength(5),Validators.maxLength(20), Validators.pattern('^OFF-.*')]],
      productId: [null,[Validators.required]],
      discountPercent: [null,[Validators.required,Validators.min(0.01), Validators.max(50)]],
      validUntilUtc: [null,[Validators.required]],
      isEnabled: [null,[Validators.required]],
    });

    super.initForm(isEdit);
  }

  protected loadData(): void {
    this.startLoading();

    // Load product and categories in parallel
    forkJoin({
      offer: this.api.getById(this.offerId),
      products: this.productsApi.lookup()
    }).subscribe({
      next: ({ offer, products }) => {
        this.model = offer;
        this.products = products;
        this.form.patchValue(offer);
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Failed to load product');
        this.toaster.error('Product not found');
        console.error('Load product error:', err);
        this.router.navigate(['/admin/product-offers']);
      }
    });
  }

  protected save(): void {
    if (this.form.invalid || this.isLoading) {
      return;
    }

    this.startLoading();

    const payload = this.form.getRawValue();

    this.api.update(this.offerId, payload).subscribe({
      next: () => {
        this.stopLoading();
        this.toaster.success('Product updated successfully');
        this.router.navigate(['/admin/product-offers']);
      },
      error: (err) => {
        this.stopLoading('Failed to update product');
        console.error('Update product error:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }

  getErrorMessage(controlName: string): string {
    return "greska";
  }
}