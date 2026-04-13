import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { API } from './api.config';
import { Promotion, PromoApplyResult } from '../models/promotion.model';
import { mockPromotions } from '../data/mock.data';

@Injectable({ providedIn: 'root' })
export class PromotionService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(API.PROMOTIONS_PUBLIC).pipe(
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
