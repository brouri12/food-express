import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotion, PromotionStats } from '../models/promotion.model';

@Injectable({ providedIn: 'root' })
export class PromotionService {
  private readonly base = 'http://localhost:8080/api/promotions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Promotion[]> { return this.http.get<Promotion[]>(this.base); }
  getStats(): Observable<PromotionStats> { return this.http.get<PromotionStats>(`${this.base}/stats`); }
  create(p: Partial<Promotion>): Observable<Promotion> { return this.http.post<Promotion>(this.base, p); }
  update(id: number, p: Partial<Promotion>): Observable<Promotion> { return this.http.put<Promotion>(`${this.base}/${id}`, p); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
}
