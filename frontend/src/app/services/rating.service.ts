import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rating, CreateRatingRequest, RatingAverage } from '../models/rating.model';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly baseUrl = 'http://localhost:8080/api/ratings';  // Via API Gateway

  constructor(private http: HttpClient) {}

  // POST /api/ratings
  createRating(rating: CreateRatingRequest): Observable<Rating> {
    return this.http.post<Rating>(this.baseUrl, rating);
  }

  // GET /api/ratings/{id}
  getRatingById(id: number): Observable<Rating> {
    return this.http.get<Rating>(`${this.baseUrl}/${id}`);
  }

  // GET /api/ratings/restaurant/{restaurantId}
  getRatingsByRestaurant(restaurantId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.baseUrl}/restaurant/${restaurantId}`);
  }

  // GET /api/ratings/restaurant/{restaurantId}/moyenne
  getAverageByRestaurant(restaurantId: number): Observable<RatingAverage> {
    return this.http.get<RatingAverage>(`${this.baseUrl}/restaurant/${restaurantId}/moyenne`);
  }

  // PUT /api/ratings/{id}
  updateRating(id: number, rating: CreateRatingRequest): Observable<Rating> {
    return this.http.put<Rating>(`${this.baseUrl}/${id}`, rating);
  }

  // DELETE /api/ratings/{id}
  deleteRating(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
