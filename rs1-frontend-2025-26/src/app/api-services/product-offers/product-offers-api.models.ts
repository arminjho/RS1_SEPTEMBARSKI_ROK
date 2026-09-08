import { BasePagedQuery } from "../../core/models/paging/base-paged-query";
import { PageResult } from "../../core/models/paging/page-result";

export enum ProductOfferStateType {
  Aktivna = 1,
  Istekla = 2,
  Iskljucena = 3,
}

export const PRODUCT_OFFER_STATE_LABELS: Record<ProductOfferStateType, string> = {
  [ProductOfferStateType.Aktivna]: 'Aktivna',
  [ProductOfferStateType.Istekla]: 'Istekla',
  [ProductOfferStateType.Iskljucena]: 'Iskljucena',
};


export class ListProductOffersRequest extends BasePagedQuery {
  productId?: number | null;
  isEnabled?: boolean | null;
  
}

/**
 * Response item for GET /Products
 * Corresponds to: ListProductsQueryDto.cs
 */
export interface ListProductOffersQueryDto {
  id: number;
  code: string;
  productName: string;
  price: number;
  discountPercent: number;
  discountedPrice: number;
  validUntilUtc: string;
  status: ProductOfferStateType;

}


export type ListProductOffersResponse = PageResult<ListProductOffersQueryDto>;

// === COMMANDS (WRITE) ===

/**
 * Command for POST /Products
 * Corresponds to: CreateProductCommand.cs
 */
export interface CreateProductOfferCommand {
 
  code: string;
  productId: number;
  
  discountPercent: number;
  validUntilUtc: Date;
  
}


export interface UpdateProductOfferCommand {
  code: string;
  productId: number;
  discountPercent: number;
  validUntilUtc: Date;
}

export interface GetProductOfferByIdQueryDto {
  id: number;
  code: string;
  productId: number;
  discountPercent: number;
  validUntilUtc: Date;
  isEnabled:boolean;
}
