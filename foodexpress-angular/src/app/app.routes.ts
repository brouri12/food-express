import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/restaurants/restaurants.component').then(m => m.RestaurantsComponent) },
      { path: 'restaurants', loadComponent: () => import('./pages/restaurants/restaurants.component').then(m => m.RestaurantsComponent) },
      { path: 'restaurant/:id', loadComponent: () => import('./pages/restaurant-menu/restaurant-menu.component').then(m => m.RestaurantMenuComponent) },
      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
        children: [
          { path: '', loadComponent: () => import('./pages/admin/admin-restaurants/admin-restaurants.component').then(m => m.AdminRestaurantsComponent) },
          { path: 'restaurants', loadComponent: () => import('./pages/admin/admin-restaurants/admin-restaurants.component').then(m => m.AdminRestaurantsComponent) },
        ]
      },
    ]
  },
  { path: '**', redirectTo: '' }
];
