import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { API } from './api.config';
import { Restaurant } from '../models/restaurant.model';
import { mockRestaurants, mockCategories } from '../data/mock.data';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(API.RESTAURANTS).pipe(
      map(list => list.map(r => this.normalize(r))),
      catchError(() => of(mockRestaurants as Restaurant[]))
    );
  }

  getPromoted(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(API.RESTAURANTS_PROMOTED).pipe(
      map(list => list.map(r => this.normalize(r))),
      catchError(() => of(mockRestaurants.filter(r => r.promoted) as Restaurant[]))
    );
  }

  getById(id: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(API.RESTAURANT_BY_ID(id)).pipe(
      map(r => this.normalize(r)),
      catchError(() => of(mockRestaurants.find(r => r.id === id) as Restaurant))
    );
  }

  /** Normalise les champs API → champs Angular (imageUrl→image, deliveryTimeRange→deliveryTime) */
  private normalize(r: any): Restaurant {
    return {
      ...r,
      image: r.image || r.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
      deliveryTime: r.deliveryTime || r.deliveryTimeRange || '25-35',
      cuisine: r.cuisine || (r.categories?.[0] ?? 'Cuisine'),
      rating: r.rating ?? 0,
      ratingCount: r.ratingCount ?? 0,
    };
  }

  getWithMenus(id: string): Observable<{ restaurant: Restaurant; menus: any }> {
    return this.http.get<any>(API.RESTAURANT_WITH_MENUS(id));
  }

  getByCategory(category: string): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(API.RESTAURANTS_CATEGORY(category)).pipe(
      map(list => list.map(r => this.normalize(r))),
      catchError(() => of(mockRestaurants.filter(r => r.categories.includes(category)) as Restaurant[]))
    );
  }

  search(query: string): Observable<Restaurant[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Restaurant[]>(API.RESTAURANTS_SEARCH, { params }).pipe(
      map(list => list.map(r => this.normalize(r))),
      catchError(() => of(mockRestaurants.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase())) as Restaurant[]))
    );
  }

  create(restaurant: Partial<Restaurant>): Observable<Restaurant> {
    return this.http.post<Restaurant>(API.RESTAURANTS_MANAGE, restaurant);
  }

  update(id: string, restaurant: Partial<Restaurant>): Observable<Restaurant> {
    return this.http.put<Restaurant>(`${API.RESTAURANTS_MANAGE}/${id}`, restaurant);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API.RESTAURANTS_MANAGE}/${id}`);
  }

  getCategories() {
    return mockCategories;
  }
}
