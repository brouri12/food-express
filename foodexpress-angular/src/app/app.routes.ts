import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'restaurants', loadComponent: () => import('./pages/restaurants/restaurants.component').then(m => m.RestaurantsComponent) },
      { path: 'restaurant/:id', loadComponent: () => import('./pages/restaurant-menu/restaurant-menu.component').then(m => m.RestaurantMenuComponent) },
      { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },
      { path: 'delivery/:orderId', loadComponent: () => import('./pages/delivery-tracking/delivery-tracking.component').then(m => m.DeliveryTrackingComponent) },
      { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
      { path: 'signup', loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent) },
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'restaurants', loadComponent: () => import('./pages/admin/admin-restaurants/admin-restaurants.component').then(m => m.AdminRestaurantsComponent) },
      { path: 'menus', loadComponent: () => import('./pages/admin/admin-menus/admin-menus.component').then(m => m.AdminMenusComponent) },
      { path: 'promotions', loadComponent: () => import('./pages/admin/admin-promotions/admin-promotions.component').then(m => m.AdminPromotionsComponent) },
      { path: 'deliveries', loadComponent: () => import('./pages/admin/admin-deliveries/admin-deliveries.component').then(m => m.AdminDeliveriesComponent) },
      { path: 'users', loadComponent: () => import('./pages/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
