import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { PromotionService } from '../../../services/promotion.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6 fade-in">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let stat of stats" class="bg-white rounded-xl shadow-sm p-6 border-l-4" [style.border-color]="stat.color">
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl">{{ stat.icon }}</span>
            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ stat.service }}</span>
          </div>
          <p class="text-3xl font-bold text-gray-900 mb-1">{{ stat.value }}</p>
          <p class="text-gray-600 text-sm">{{ stat.label }}</p>
          <div class="mt-3 flex items-center gap-1 text-sm" [class]="stat.trend > 0 ? 'text-green-600' : 'text-red-500'">
            <span>{{ stat.trend > 0 ? '↑' : '↓' }}</span>
            <span>{{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}% ce mois</span>
          </div>
        </div>
      </div>

      <!-- Services Status -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">🔌 État des Micro-services</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let svc of services"
               class="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ svc.icon }}</span>
              <div>
                <p class="font-semibold text-gray-900 text-sm">{{ svc.name }}</p>
                <p class="text-xs text-gray-500">Port {{ svc.port }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div [class]="'w-2 h-2 rounded-full ' + (svc.status === 'UP' ? 'bg-green-500 animate-pulse' : 'bg-red-500')"></div>
              <span [class]="'text-xs font-semibold ' + (svc.status === 'UP' ? 'text-green-600' : 'text-red-500')">
                {{ svc.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Restaurants -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-900">🏪 Restaurants récents</h2>
            <a routerLink="/admin/restaurants" class="text-orange-600 hover:text-orange-700 text-sm font-semibold">Voir tout →</a>
          </div>
          <div class="space-y-3">
            <div *ngFor="let r of restaurants().slice(0, 4)"
                 class="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:border-orange-200 transition-colors">
              <img [src]="r.image" [alt]="r.name" class="w-12 h-12 rounded-lg object-cover" />
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 text-sm truncate">{{ r.name }}</p>
                <p class="text-xs text-gray-500">{{ r.cuisine }} • ⭐ {{ r.rating }}</p>
              </div>
              <span [class]="'text-xs px-2 py-1 rounded-full font-semibold ' + (r.active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')">
                {{ r.active !== false ? 'Actif' : 'Inactif' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Active Promotions -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-900">🏷️ Promotions actives</h2>
            <a routerLink="/admin/promotions" class="text-orange-600 hover:text-orange-700 text-sm font-semibold">Gérer →</a>
          </div>
          <div class="space-y-3">
            <div *ngFor="let p of promotions().slice(0, 3)"
                 class="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl">
              <div class="flex items-start justify-between">
                <div>
                  <p class="font-semibold text-gray-900 text-sm">{{ p.title }}</p>
                  <p *ngIf="p.code" class="text-xs text-orange-600 font-mono mt-1 bg-orange-100 px-2 py-0.5 rounded inline-block">
                    {{ p.code }}
                  </p>
                </div>
                <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">Active</span>
              </div>
              <p class="text-xs text-gray-500 mt-2">Expire le {{ p.validUntil }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">⚡ Actions rapides</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a routerLink="/admin/restaurants"
             class="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer">
            <span class="text-3xl">🏪</span>
            <span class="text-sm font-semibold text-blue-700">Ajouter restaurant</span>
          </a>
          <a routerLink="/admin/menus"
             class="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors cursor-pointer">
            <span class="text-3xl">🍽️</span>
            <span class="text-sm font-semibold text-green-700">Ajouter plat</span>
          </a>
          <a routerLink="/admin/promotions"
             class="flex flex-col items-center gap-2 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors cursor-pointer">
            <span class="text-3xl">🏷️</span>
            <span class="text-sm font-semibold text-orange-700">Créer promo</span>
          </a>
          <a routerLink="/admin/deliveries"
             class="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors cursor-pointer">
            <span class="text-3xl">🛵</span>
            <span class="text-sm font-semibold text-purple-700">Voir livraisons</span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  restaurants = signal<any[]>([]);
  promotions = signal<any[]>([]);

  stats = [
    { icon: '🏪', label: 'Restaurants actifs', value: '6', trend: 12, color: '#f97316', service: 'restaurant-service' },
    { icon: '📦', label: 'Commandes aujourd\'hui', value: '142', trend: 8, color: '#3b82f6', service: 'order-service' },
    { icon: '🛵', label: 'Livraisons en cours', value: '23', trend: -3, color: '#8b5cf6', service: 'delivery-service' },
    { icon: '💰', label: 'Revenus du jour', value: '2 847€', trend: 15, color: '#10b981', service: 'order-service' },
  ];

  services = [
    { name: 'Eureka Server', port: 8761, icon: '🔍', status: 'UP' },
    { name: 'API Gateway', port: 8080, icon: '🚪', status: 'UP' },
    { name: 'Config Server', port: 8888, icon: '⚙️', status: 'UP' },
    { name: 'User Service', port: 8081, icon: '👤', status: 'UP' },
    { name: 'Restaurant Service', port: 8082, icon: '🏪', status: 'UP' },
    { name: 'Menu Service', port: 8083, icon: '🍽️', status: 'UP' },
    { name: 'Promotion Service', port: 8084, icon: '🏷️', status: 'UP' },
    { name: 'Delivery Service', port: 8085, icon: '🛵', status: 'UP' },
    { name: 'RabbitMQ', port: 15672, icon: '🐰', status: 'UP' },
  ];

  constructor(
    private restaurantService: RestaurantService,
    private promotionService: PromotionService
  ) {}

  ngOnInit(): void {
    this.restaurantService.getAll().subscribe(d => this.restaurants.set(d));
    this.promotionService.getAll().subscribe(d => this.promotions.set(d));
  }
}
