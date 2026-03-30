import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant, RestaurantStats } from '../models/restaurant.model';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private readonly base = 'http://localhost:8080/api/restaurants';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Restaurant[]> { return this.http.get<Restaurant[]>(`${this.base}/all`); }
  getStats(): Observable<RestaurantStats> { return this.http.get<RestaurantStats>(`${this.base}/stats`); }
  create(r: Partial<Restaurant>): Observable<Restaurant> { return this.http.post<Restaurant>(this.base, r); }
  update(id: number, r: Partial<Restaurant>): Observable<Restaurant> { return this.http.put<Restaurant>(`${this.base}/${id}`, r); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
}
