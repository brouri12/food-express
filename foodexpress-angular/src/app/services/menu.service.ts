import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, map, tap } from 'rxjs';
import { API } from './api.config';
import { MenuItem } from '../models/menu.model';
import { mockMenus } from '../data/mock.data';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly menuCache = new Map<string, { data: Record<string, MenuItem[]>; ts: number }>();
  private readonly cacheTtlMs = 5 * 60 * 1000;

  constructor(private http: HttpClient) {}

  getByRestaurant(restaurantId: string): Observable<Record<string, MenuItem[]>> {
    this.pruneExpiredCache();
    const cached = this.menuCache.get(restaurantId);
    if (cached && Date.now() - cached.ts < this.cacheTtlMs) {
      return of(cached.data);
    }

    return this.http.get<Record<string, MenuItem[]>>(API.MENUS_BY_RESTAURANT(restaurantId)).pipe(
      // Normalise les champs texte pour éviter les erreurs d'affichage/filtre.
      map(grouped => this.normalizeGroupedMenu(grouped)),
      tap(grouped => this.menuCache.set(restaurantId, { data: grouped, ts: Date.now() })),
      catchError(() => {
        const mock = mockMenus[restaurantId];
        if (!mock) return of({});
        const grouped: Record<string, MenuItem[]> = {};
        mock.categories.forEach((cat: any) => { grouped[cat.name] = cat.items; });
        const normalized = this.normalizeGroupedMenu(grouped);
        this.menuCache.set(restaurantId, { data: normalized, ts: Date.now() });
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
    return this.http.post<MenuItem>(API.MENUS_MANAGE, item).pipe(
      tap(() => this.clearCacheForRestaurant(item.restaurantId))
    );
  }

  update(id: string, item: Partial<MenuItem>): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${API.MENUS_MANAGE}/${id}`, item).pipe(
      tap(() => this.clearCacheForRestaurant(item.restaurantId))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API.MENUS_MANAGE}/${id}`).pipe(
      tap(() => this.menuCache.clear())
    );
  }

  clearMenuCache(): void {
    this.menuCache.clear();
  }

  getCacheSize(): number {
    return this.menuCache.size;
  }

  getCachedRestaurantIds(): string[] {
    return Array.from(this.menuCache.keys());
  }

  private normalizeGroupedMenu(grouped: Record<string, MenuItem[]>): Record<string, MenuItem[]> {
    const normalized: Record<string, MenuItem[]> = {};
    Object.entries(grouped || {}).forEach(([category, items]) => {
      normalized[category] = (items || []).map(item => this.normalizeItem(item));
    });
    return normalized;
  }

  private clearCacheForRestaurant(restaurantId?: string): void {
    if (!restaurantId) {
      this.menuCache.clear();
      return;
    }
    this.menuCache.delete(restaurantId);
  }

  private pruneExpiredCache(): void {
    const now = Date.now();
    this.menuCache.forEach((value, key) => {
      if (now - value.ts >= this.cacheTtlMs) {
        this.menuCache.delete(key);
      }
    });
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
