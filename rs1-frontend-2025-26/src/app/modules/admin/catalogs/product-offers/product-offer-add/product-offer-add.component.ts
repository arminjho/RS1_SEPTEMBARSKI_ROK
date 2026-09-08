import { Component, inject, OnInit } from '@angular/core';
import { Form, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../core/components/base-classes/base-form-component';
import { GetProductByIdQueryDto } from '../../../../../api-services/products/products-api.models';
import { ProductOffersApiService } from '../../../../../api-services/product-offers/product-offers-api.service';
import { ProductsApiService } from '../../../../../api-services/products/products-api.service';
import { ToasterService } from '../../../../../core/services/toaster.service';
import { ExamProductLookupItem } from '../../../../../api-services/exam-products/exam-products-api.models';
import { ExamProductsApiService } from '../../../../../api-services/exam-products/exam-products-api.service';
import { CreateProductOfferCommand } from '../../../../../api-services/product-offers/product-offers-api.models';

@Component({ selector: 'app-product-offer-add', standalone: false, templateUrl: './product-offer-add.component.html', styleUrl: './product-offer-add.component.scss' })
export class ProductOfferAddComponent
  extends BaseFormComponent<any>
  implements OnInit {

  private api = inject(ProductOffersApiService);
  private productsApi = inject(ExamProductsApiService);
  private formService = inject(FormBuilder);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  products: ExamProductLookupItem[] = [];

  ngOnInit(): void {
    this.initForm(false); // Add mode
    this.loadCategories();
  }

  protected loadData(): void {
    // Not needed in add mode
  }

  protected save(): void {
    if (this.form.invalid || this.isLoading) {
      return;
    }

    this.startLoading();

    const command=this.form.getRawValue();

    this.api.create(command).subscribe({
      next: (productId) => {
        this.stopLoading();
        this.toaster.success('Product created successfully');
        this.router.navigate(['/admin/product-offers']);
      },
      error: (err) => {
        this.stopLoading('Failed to create product');
        console.error('Create product error:', err);
      }
    });
  }

  private loadCategories(): void {
    this.productsApi.lookup().subscribe({
      next: (response) => {
        this.products = response;
      },
      error: (err) => {
        this.toaster.error('Failed to load categories');
        console.error('Load categories error:', err);
      }
    });
  }

  protected override initForm(isEdit: boolean): void {
    super.initForm(isEdit);
    this.form = this.formService.group({
      code: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(20), Validators.pattern('^OFF-.*')]],
      productId: ['',Validators.required],
      discountPercent: ['',Validators.required,[Validators.min(0.01), Validators.max(50)]],
      validUntilUtc: ['',Validators.required],
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/product-offers']);
  }

  








  
  
  cancel(): void { this.router.navigate(['/admin/product-offers']); }
  save1(): void { /* TODO: student implementira validaciju i snimanje. */ }
}
