import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { API } from './api.config';
import { Promotion, PromoApplyResult } from '../models/promotion.model';
import { mockPromotions } from '../data/mock.data';

@Injectable({ providedIn: 'root' })
export class PromotionService {
  constructor(private http: HttpClient) {}

  private readonly promoImages: Record<string, string> = {
    PERCENTAGE:      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
    FIXED_AMOUNT:    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    FREE_DELIVERY:   'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=400&fit=crop',
    BUY_ONE_GET_ONE: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop',
  };

  private normalize(p: any): Promotion {
    return {
      ...p,
      image: p.imageUrl || p.image || this.promoImages[p.type] || this.promoImages['PERCENTAGE'],
    };
  }

  getAll(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(API.PROMOTIONS_PUBLIC).pipe(
      map(list => list.map(p => this.normalize(p))),
      catchError(() => of(mockPromotions as Promotion[]))
    );
  }

  applyCode(code: string, orderAmount: number): Observable<PromoApplyResult> {
    const params = new HttpParams().set('code', code).set('orderAmount', orderAmount.toString());
    return this.http.post<PromoApplyResult>(API.PROMOTIONS_APPLY, null, { params }).pipe(
      catchError(() => {
        // Fallback local
        const promo = mockPromotions.find(p => p.code?.toLowerCase() === code.toLowerCase());
        if (!promo) throw new Error('Code promo invalide');
        const discount = promo.type === 'percentage' ? (orderAmount * (promo.discount || 0)) / 100 : 0;
        return of({ promoId: promo.id, code: promo.code!, type: promo.type,
          originalAmount: orderAmount, discount, finalAmount: orderAmount - discount } as PromoApplyResult);
      })
    );
  }

  create(promo: Partial<Promotion>): Observable<Promotion> {
    return this.http.post<Promotion>(API.PROMOTIONS_MANAGE, promo);
  }

  update(id: string, promo: Partial<Promotion>): Observable<Promotion> {
    return this.http.put<Promotion>(`${API.PROMOTIONS_MANAGE}/${id}`, promo);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API.PROMOTIONS_MANAGE}/${id}`);
  }
}
