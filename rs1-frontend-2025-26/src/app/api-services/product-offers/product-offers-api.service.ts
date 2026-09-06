import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { buildHttpParams } from '../../core/models/build-http-params';
import { CreateProductOfferCommand, ListProductOffersRequest, ListProductOffersResponse } from './product-offers-api.models';

@Injectable({
  providedIn: 'root'
})
export class ProductOffersApiService {
  private readonly baseUrl = `${environment.apiUrl}/ProductOffers`;
  private http = inject(HttpClient);

  /**
   * GET /Products
   * List products with optional query parameters.
   */
  list(request?: ListProductOffersRequest): Observable<ListProductOffersResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;

    return this.http.get<ListProductOffersResponse>(this.baseUrl, {
      params,
    });
  }

  /**
   * GET /Products/{id}
   * Get a single product by ID.
   */


  /**
   * POST /Products
   * Create a new product.
   * @returns ID of the newly created product
   */
  create(payload: CreateProductOfferCommand): Observable<number> {
    return this.http.post<number>(this.baseUrl, payload);
  }

  /**
   * PUT /Products/{id}
   * Update an existing product.
   */
 

  /**
   * DELETE /Products/{id}
   * Delete a product.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
