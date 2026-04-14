import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Order, CreateOrderRequest } from '../models/order.model';
import { API_BASE } from './api.config';

const BASE = `${API_BASE}/api/orders`;

@Injectable({ providedIn: 'root' })
export class OrderService {

  constructor(private http: HttpClient) {}

  /** POST /api/orders — Créer une commande */
  createOrder(order: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(BASE, order);
  }

  /** GET /api/orders — Toutes les commandes (admin) */
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(BASE).pipe(catchError(() => of([])));
  }

  /** GET /api/orders/{id} */
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${BASE}/${id}`);
  }

  /** GET /api/orders/user/{userId} */
  getOrdersByUser(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${BASE}/user/${userId}`).pipe(catchError(() => of([])));
  }

  /** GET /api/orders/restaurant/{restaurantId} */
  getByRestaurant(restaurantId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${BASE}/restaurant/${restaurantId}`).pipe(catchError(() => of([])));
  }

  /** GET /api/orders/restaurant/{restaurantId} */
  getOrdersByRestaurant(restaurantId: string): Observable<Order[]> {
    return this.getByRestaurant(restaurantId);
  }

  /** PATCH /api/orders/{id}/status */
  updateStatus(id: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${BASE}/${id}/status`, { status });
  }

  /** DELETE /api/orders/{id} */
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/${id}`);
  }

  /** GET /api/orders/{id}/qrcode — URL de l'image QR */
  getQRCodeUrl(id: number): string {
    return `${BASE}/${id}/qrcode`;
  }
}
