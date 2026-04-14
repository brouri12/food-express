import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { API } from './api.config';
import { MenuItem } from '../models/menu.model';
import { mockMenus } from '../data/mock.data';

const MENU_FALLBACKS: Record<string, string> = {
  Burgers:         'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
  Pizza:           'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop',
  Sushi:           'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
  Desserts:        'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=200&fit=crop',
  Boissons:        'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop',
  Accompagnements: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop',
  default:         'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop',
};

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(private http: HttpClient) {}

  private normalizeItem(item: any): MenuItem {
    return {
      ...item,
      image: item.imageUrl || item.image || MENU_FALLBACKS[item.category] || MENU_FALLBACKS['default'],
      imageUrl: item.imageUrl || item.image,
    };
  }

  getByRestaurant(restaurantId: string): Observable<Record<string, MenuItem[]>> {
    return this.http.get<Record<string, MenuItem[]>>(API.MENUS_BY_RESTAURANT(restaurantId)).pipe(
      map(grouped => {
        const result: Record<string, MenuItem[]> = {};
        for (const cat of Object.keys(grouped)) {
          result[cat] = grouped[cat].map(i => this.normalizeItem(i));
        }
        return result;
      }),
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
