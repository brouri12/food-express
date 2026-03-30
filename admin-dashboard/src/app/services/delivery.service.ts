import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Delivery, DeliveryStats, DeliveryStatus, Driver } from '../models/delivery.model';

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private readonly base = 'http://localhost:8080/api/deliveries';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Delivery[]> { return this.http.get<Delivery[]>(this.base); }
  getStats(): Observable<DeliveryStats> { return this.http.get<DeliveryStats>(`${this.base}/stats`); }
  updateStatus(id: number, status: DeliveryStatus): Observable<Delivery> {
    return this.http.put<Delivery>(`${this.base}/${id}/status?status=${status}`, {});
  }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }

  getAllDrivers(): Observable<Driver[]> { return this.http.get<Driver[]>(`${this.base}/drivers`); }
  createDriver(d: Partial<Driver>): Observable<Driver> { return this.http.post<Driver>(`${this.base}/drivers`, d); }
  updateDriver(id: number, d: Partial<Driver>): Observable<Driver> { return this.http.put<Driver>(`${this.base}/drivers/${id}`, d); }
  deleteDriver(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/drivers/${id}`); }
}
