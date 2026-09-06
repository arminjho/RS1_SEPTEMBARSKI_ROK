import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListProductOffersQueryDto, ListProductOffersRequest, ProductOfferStateType } from '../../../../api-services/product-offers/product-offers-api.models';
import { BaseListPagedComponent } from '../../../../core/components/base-classes/base-list-paged-component';
import { ProductOffersApiService } from '../../../../api-services/product-offers/product-offers-api.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { DialogHelperService } from '../../../shared/services/dialog-helper.service';
import { DialogButton } from '../../../shared/models/dialog-config.model';
import { ListProductsQueryDto } from '../../../../api-services/products/products-api.models';
import { ProductsApiService } from '../../../../api-services/products/products-api.service';
import { ExamProductsApiService } from '../../../../api-services/exam-products/exam-products-api.service';
import { ExamProductLookupItem } from '../../../../api-services/exam-products/exam-products-api.models';

@Component({
  selector: 'app-product-offers',
  standalone: false,
  templateUrl: './product-offers.component.html',
  styleUrl: './product-offers.component.scss',
})
export class ProductOffersComponent 
  extends BaseListPagedComponent<ListProductOffersQueryDto, ListProductOffersRequest>
  implements OnInit {

  private api = inject(ProductOffersApiService);
  private productsApiLookup = inject(ExamProductsApiService);
  private router = inject(Router);
  private toaster = inject(ToasterService);
  private dialogHelper = inject(DialogHelperService);

 readonly displayedColumns = ['code', 'productName', 'price', 'discountPercent', 'discountedPrice', 'validUntilUtc', 'status', 'actions'];

 products:ExamProductLookupItem[] = [];  

  constructor() {
    super();
    this.request = new ListProductOffersRequest();
  }

  ngOnInit(): void {
    this.initList();
    this.loadProducts(); 
    this.request.paging.pageSize = 5;

  }

  protected loadPagedData(): void {
    this.startLoading();

    this.api.list(this.request).subscribe({
      next: (response) => {
        this.handlePageResult(response);
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Failed to load offers');
        console.error('Load offers error:', err);
      }
    });
  }


  protected loadProducts(): void {
    this.startLoading();

    this.productsApiLookup.lookup().subscribe({
      next: (response) => {
        this.products = response;  
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Failed to load products');
        console.error('Load products error:', err);
      }
    });
  }

  // === UI Actions ===

  onCreate(): void {
    this.router.navigate(['/admin/product-offers/add']);
  }

  onEdit(product: ListProductOffersQueryDto): void {
    this.router.navigate(['/admin/product-offers', product.id, 'edit']);
  }

  onDelete(product: ListProductOffersQueryDto): void {
    this.dialogHelper.offer.confirmDelete(product.code).subscribe(result => {
      if (result && result.button === DialogButton.DELETE) {
        this.performDelete(product);
      }
    });
  }

  private performDelete(product: ListProductOffersQueryDto): void {
    this.startLoading();

    this.api.delete(product.id).subscribe({
      next: () => {
        this.dialogHelper.offer.showDeleteSuccess().subscribe();
        this.loadPagedData();
      },
      error: (err) => {
        this.stopLoading();

        this.dialogHelper.showError(
          'DIALOGS.TITLES.ERROR',
          'PRODUCTS.DIALOGS.ERROR_DELETE'
        ).subscribe();

        console.error('Delete product error:', err);
      }
    });
  }

  onSearch(): void {
    this.request.paging.page = 1;
    this.loadPagedData();
  }


  add(): void { this.router.navigate(['/admin/product-offers/add']); }
  edit(id: number): void { this.router.navigate(['/admin/product-offers/edit', id]); }
  delete(id: number): void { void id; /* TODO: student implementira potvrdu i brisanje. */ }
  filtersChanged(): void { 
    
    this.request.paging.page = 1;
    this.loadPagedData(); 
  }
   }

