import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, map, tap } from 'rxjs';
import { API } from './api.config';
import { MenuItem } from '../models/menu.model';
import { mockMenus } from '../data/mock.data';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly menuCache = new Map<string, Record<string, MenuItem[]>>();

  constructor(private http: HttpClient) {}

  getByRestaurant(restaurantId: string): Observable<Record<string, MenuItem[]>> {
    const cached = this.menuCache.get(restaurantId);
    if (cached) {
      return of(cached);
    }

    return this.http.get<Record<string, MenuItem[]>>(API.MENUS_BY_RESTAURANT(restaurantId)).pipe(
      // Normalise les champs texte pour éviter les erreurs d'affichage/filtre.
      map(grouped => this.normalizeGroupedMenu(grouped)),
      tap(grouped => this.menuCache.set(restaurantId, grouped)),
      catchError(() => {
        const mock = mockMenus[restaurantId];
        if (!mock) return of({});
        const grouped: Record<string, MenuItem[]> = {};
        mock.categories.forEach((cat: any) => { grouped[cat.name] = cat.items; });
        const normalized = this.normalizeGroupedMenu(grouped);
        this.menuCache.set(restaurantId, normalized);
        return of(normalized);
      })
    );
  }

  getPopular(restaurantId: string): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(API.MENUS_POPULAR(restaurantId)).pipe(
      map(items => items.map(item => this.normalizeItem(item))),
      catchError(() => of([]))
    );
  }

  search(query: string): Observable<MenuItem[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<MenuItem[]>(API.MENUS_SEARCH, { params }).pipe(
      map(items => items.map(item => this.normalizeItem(item))),
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

  private normalizeGroupedMenu(grouped: Record<string, MenuItem[]>): Record<string, MenuItem[]> {
    const normalized: Record<string, MenuItem[]> = {};
    Object.entries(grouped || {}).forEach(([category, items]) => {
      normalized[category] = (items || []).map(item => this.normalizeItem(item));
    });
    return normalized;
  }

  private normalizeItem(item: MenuItem): MenuItem {
    return {
      ...item,
      name: item.name || 'Plat',
      description: item.description || '',
      category: item.category || 'Autres',
      available: item.available !== false
    };
  }
}
