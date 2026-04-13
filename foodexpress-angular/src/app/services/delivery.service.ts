import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { API } from './api.config';
import { Delivery, DeliveryCalculation, DeliveryStatus } from '../models/delivery.model';
import { mockDelivery } from '../data/mock.data';

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  constructor(private http: HttpClient) {}

  getByOrder(orderId: string): Observable<Delivery> {
    return this.http.get<Delivery>(API.DELIVERY_BY_ORDER(orderId)).pipe(
      catchError(() => of(mockDelivery as unknown as Delivery))
    );
  }

  calculate(rLat: number, rLng: number, dLat: number, dLng: number): Observable<DeliveryCalculation> {
    const params = new HttpParams()
      .set('restaurantLat', rLat).set('restaurantLng', rLng)
      .set('deliveryLat', dLat).set('deliveryLng', dLng);
    return this.http.get<DeliveryCalculation>(API.DELIVERY_CALCULATE, { params }).pipe(
      catchError(() => of({ distanceKm: 3.2, deliveryFee: 2.5, estimatedTimeMin: 25,
        estimatedTimeMax: 35, estimatedTime: 30, displayRange: '25-35 min' }))
    );
  }

  updateStatus(orderId: string, status: DeliveryStatus): Observable<Delivery> {
    const params = new HttpParams().set('status', status);
    return this.http.put<Delivery>(API.DELIVERY_STATUS(orderId), null, { params });
  }
}
