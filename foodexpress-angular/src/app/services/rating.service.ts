import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Rating, CreateRatingRequest, RatingAverage } from '../models/rating.model';
import { API_BASE } from './api.config';

const BASE = `${API_BASE}/api/ratings`;

@Injectable({ providedIn: 'root' })
export class RatingService {

  constructor(private http: HttpClient) {}

  /** POST /api/ratings — Créer un avis */
  createRating(rating: CreateRatingRequest, userId?: string): Observable<Rating> {
    const headers: Record<string, string> = {};
    if (userId) headers['X-User-Id'] = userId;
    return this.http.post<Rating>(BASE, rating, { headers });
  }

  /** GET /api/ratings/restaurant/{id} — Tous les avis d'un restaurant */
  getRatingsByRestaurant(restaurantId: string): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${BASE}/restaurant/${restaurantId}`).pipe(
      catchError(() => of([]))
    );
  }

  /** GET /api/ratings/restaurant/{id}/moyenne — Moyenne */
  getAverageByRestaurant(restaurantId: string): Observable<RatingAverage> {
    return this.http.get<RatingAverage>(`${BASE}/restaurant/${restaurantId}/moyenne`).pipe(
      catchError(() => of({ average: 0, count: 0, restaurantId }))
    );
  }

  /** PUT /api/ratings/{id} — Modifier un avis */
  updateRating(id: number, rating: CreateRatingRequest, userId?: string): Observable<Rating> {
    const headers: Record<string, string> = {};
    if (userId) headers['X-User-Id'] = userId;
    return this.http.put<Rating>(`${BASE}/${id}`, rating, { headers });
  }

  /** DELETE /api/ratings/{id} — Supprimer un avis */
  deleteRating(id: number, userId?: string, isAdmin = false): Observable<void> {
    const headers: Record<string, string> = {};
    if (userId) headers['X-User-Id'] = userId;
    if (isAdmin) headers['X-Admin'] = 'true';
    return this.http.delete<void>(`${BASE}/${id}`, { headers });
  }
}
