import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MenuItem, MenuCategory, MenuStats } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:8084/api/menu'; // Menu service URL

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Menu Items
  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/items`, { headers: this.getHeaders() });
  }

  getMenuItemById(id: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.apiUrl}/items/${id}`, { headers: this.getHeaders() });
  }

  getMenuItemsByCategory(categoryId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/items/category/${categoryId}`, { headers: this.getHeaders() });
  }

  getMenuItemsByRestaurant(restaurantId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/items/restaurant/${restaurantId}`, { headers: this.getHeaders() });
  }

  createMenuItem(item: MenuItem): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.apiUrl}/items`, item, { headers: this.getHeaders() });
  }

  updateMenuItem(id: number, item: MenuItem): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/items/${id}`, item, { headers: this.getHeaders() });
  }

  deleteMenuItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`, { headers: this.getHeaders() });
  }

  toggleItemAvailability(id: number): Observable<MenuItem> {
    return this.http.patch<MenuItem>(`${this.apiUrl}/items/${id}/toggle-availability`, {}, { headers: this.getHeaders() });
  }

  // Menu Categories
  getMenuCategories(): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(`${this.apiUrl}/categories`, { headers: this.getHeaders() });
  }

  getMenuCategoryById(id: number): Observable<MenuCategory> {
    return this.http.get<MenuCategory>(`${this.apiUrl}/categories/${id}`, { headers: this.getHeaders() });
  }

  getCategoriesByRestaurant(restaurantId: number): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(`${this.apiUrl}/categories/restaurant/${restaurantId}`, { headers: this.getHeaders() });
  }

  createMenuCategory(category: MenuCategory): Observable<MenuCategory> {
    return this.http.post<MenuCategory>(`${this.apiUrl}/categories`, category, { headers: this.getHeaders() });
  }

  updateMenuCategory(id: number, category: MenuCategory): Observable<MenuCategory> {
    return this.http.put<MenuCategory>(`${this.apiUrl}/categories/${id}`, category, { headers: this.getHeaders() });
  }

  deleteMenuCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`, { headers: this.getHeaders() });
  }

  // Statistics
  getMenuStats(): Observable<MenuStats> {
    return this.http.get<MenuStats>(`${this.apiUrl}/stats`, { headers: this.getHeaders() });
  }

  // Mock data for development (remove when backend is ready)
  getMockMenuItems(): Observable<MenuItem[]> {
    const mockItems: MenuItem[] = [
      {
        id: 1,
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 12.99,
        imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300',
        available: true,
        categoryId: 1,
        categoryName: 'Pizza',
        restaurantId: 1,
        restaurantName: 'Mario\'s Pizzeria'
      },
      {
        id: 2,
        name: 'Chicken Caesar Salad',
        description: 'Fresh romaine lettuce with grilled chicken, parmesan, and caesar dressing',
        price: 9.99,
        imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300',
        available: true,
        categoryId: 2,
        categoryName: 'Salads',
        restaurantId: 1,
        restaurantName: 'Mario\'s Pizzeria'
      },
      {
        id: 3,
        name: 'Beef Burger',
        description: 'Juicy beef patty with lettuce, tomato, onion, and special sauce',
        price: 11.50,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
        available: false,
        categoryId: 3,
        categoryName: 'Burgers',
        restaurantId: 2,
        restaurantName: 'Burger House'
      },
      {
        id: 4,
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with chocolate frosting',
        price: 6.99,
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
        available: true,
        categoryId: 4,
        categoryName: 'Desserts',
        restaurantId: 1,
        restaurantName: 'Mario\'s Pizzeria'
      }
    ];
    return of(mockItems);
  }

  getMockMenuCategories(): Observable<MenuCategory[]> {
    const mockCategories: MenuCategory[] = [
      {
        id: 1,
        name: 'Pizza',
        description: 'Delicious wood-fired pizzas',
        restaurantId: 1,
        restaurantName: 'Mario\'s Pizzeria',
        displayOrder: 1,
        active: true
      },
      {
        id: 2,
        name: 'Salads',
        description: 'Fresh and healthy salads',
        restaurantId: 1,
        restaurantName: 'Mario\'s Pizzeria',
        displayOrder: 2,
        active: true
      },
      {
        id: 3,
        name: 'Burgers',
        description: 'Gourmet burgers and sandwiches',
        restaurantId: 2,
        restaurantName: 'Burger House',
        displayOrder: 1,
        active: true
      },
      {
        id: 4,
        name: 'Desserts',
        description: 'Sweet treats and desserts',
        restaurantId: 1,
        restaurantName: 'Mario\'s Pizzeria',
        displayOrder: 3,
        active: true
      }
    ];
    return of(mockCategories);
  }

  getMockMenuStats(): Observable<MenuStats> {
    const mockStats: MenuStats = {
      totalItems: 4,
      totalCategories: 4,
      availableItems: 3,
      unavailableItems: 1,
      averagePrice: 10.24,
      mostExpensiveItem: {
        id: 1,
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 12.99,
        available: true,
        categoryId: 1,
        restaurantId: 1
      },
      cheapestItem: {
        id: 4,
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with chocolate frosting',
        price: 6.99,
        available: true,
        categoryId: 4,
        restaurantId: 1
      }
    };
    return of(mockStats);
  }
}