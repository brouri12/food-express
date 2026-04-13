import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { API } from './api.config';
import { MenuItem } from '../models/menu.model';
import { mockMenus } from '../data/mock.data';

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(private http: HttpClient) {}

  getByRestaurant(restaurantId: string): Observable<Record<string, MenuItem[]>> {
    return this.http.get<Record<string, MenuItem[]>>(API.MENUS_BY_RESTAURANT(restaurantId)).pipe(
      catchError(() => {
        const mock = mockMenus[restaurantId];
        if (!mock) return of({});
        const grouped: Record<string, MenuItem[]> = {};
        mock.categories.forEach((cat: any) => { grouped[cat.name] = cat.items; });
        return of(grouped);
      })
    );
  }

  getPopular(restaurantId: string): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(API.MENUS_POPULAR(restaurantId)).pipe(
      catchError(() => of([]))
    );
  }

  search(query: string): Observable<MenuItem[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<MenuItem[]>(API.MENUS_SEARCH, { params }).pipe(
      catchError(() => of([]))
    );
  }

  create(item: Partial<MenuItem>): Observable<MenuItem> {
    return this.http.post<MenuItem>(API.MENUS_MANAGE, item);
  }

  update(id: string, item: Partial<MenuItem>): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${API.MENUS_MANAGE}/${id}`, item);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API.MENUS_MANAGE}/${id}`);
  }
}
