import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RestaurantService } from '../../services/restaurant.service';
import { MenuService } from '../../services/menu.service';
import { OrderService } from '../../services/order.service';
import { SafeImgPipe } from '../../shared/safe-img.pipe';
import { Restaurant } from '../../models/restaurant.model';
import { API_BASE } from '../../services/api.config';

@Component({
  selector: 'app-restaurant-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeImgPipe],
  template: `
    <div class="min-h-screen bg-gray-50">

      <!-- Header -->
      <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-5">
        <div class="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">🍽️ Mon Restaurant</h1>
            <p class="text-white/80 text-sm mt-1">{{ auth.currentUser()?.firstName }} — Tableau de bord restaurateur</p>
          </div>
          <button (click)="loadAll()" class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
            🔄 Actualiser
          </button>
        </div>
      </div>

      <div class="max-w-5xl mx-auto px-4 py-8 space-y-8">

        <!-- No restaurant warning -->
        <div *ngIf="!loading() && !myRestaurant()" class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p class="text-4xl mb-3">🏪</p>
          <p class="font-bold text-gray-900 mb-2">Aucun restaurant associé à votre compte</p>
          <p class="text-gray-500 text-sm">Contactez l'administrateur pour associer un restaurant à votre compte.</p>
        </div>

        <ng-container *ngIf="myRestaurant()">

          <!-- Restaurant Info Card -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="relative h-40">
              <img [src]="(myRestaurant()!.imageUrl || myRestaurant()!.image) | safeImg:'restaurant'"
                   [alt]="myRestaurant()!.name" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <h2 class="text-xl font-bold">{{ myRestaurant()!.name }}</h2>
                <p class="text-sm text-white/80">{{ myRestaurant()!.cuisine }} • {{ myRestaurant()!.deliveryTime }} min</p>
              </div>
            </div>
            <div class="p-4 flex items-center gap-6 text-sm text-gray-600">
              <span>⭐ {{ myRestaurant()!.rating }} ({{ myRestaurant()!.ratingCount }} avis)</span>
              <span>💰 Livraison {{ myRestaurant()!.deliveryFee | number:'1.2-2' }}€</span>
              <span>🛒 Min {{ myRestaurant()!.minOrder }}€</span>
              <span [class]="myRestaurant()!.active ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'">
                {{ myRestaurant()!.active ? '✅ Ouvert' : '❌ Fermé' }}
              </span>
            </div>
          </div>

          <!-- Tabs -->
          <div class="flex gap-2 border-b border-gray-200 overflow-x-auto">
            <button (click)="tab = 'orders'" [class]="tabClass('orders')">
              📦 Commandes
              <span *ngIf="pendingCount() > 0" class="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{{ pendingCount() }}</span>
            </button>
            <button (click)="tab = 'menu'" [class]="tabClass('menu')">🍽️ Mon Menu</button>
            <button (click)="tab = 'add'" [class]="tabClass('add')">➕ Ajouter un plat</button>
            <button (click)="tab = 'hours'; loadHours()" [class]="tabClass('hours')">🕐 Horaires</button>
            <button (click)="tab = 'stats'; loadStats()" [class]="tabClass('stats')">📊 Statistiques</button>
          </div>

          <!-- ── ORDERS TAB ── -->
          <div *ngIf="tab === 'orders'" class="space-y-4">
            <div *ngIf="loadingOrders()" class="text-center py-8 text-gray-400">Chargement...</div>

            <div *ngIf="!loadingOrders() && orders().length === 0" class="text-center py-12 text-gray-400">
              <p class="text-4xl mb-3">📭</p>
              <p>Aucune commande pour l'instant</p>
            </div>

            <div *ngFor="let o of orders()"
                 class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="font-bold text-gray-900">#{{ o.id }}</span>
                    <span [class]="'px-2 py-0.5 text-xs font-semibold rounded-full ' + orderStatusClass(o.status)">
                      {{ orderStatusLabel(o.status) }}
                    </span>
                    <span class="text-xs text-gray-400">{{ o.createdAt | date:'dd/MM HH:mm' }}</span>
                  </div>
                  <p class="text-sm text-gray-700 mb-1">👤 {{ o.clientName }}</p>
                  <p class="text-sm text-gray-600 mb-2">📍 {{ o.deliveryAddress }}</p>
                  <div class="flex flex-wrap gap-1 mb-2">
                    <span *ngFor="let item of o.items"
                          class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      {{ item.quantity }}x {{ item.menuItemName }}
                    </span>
                  </div>
                  <p class="font-bold text-orange-600">{{ o.totalAmount | number:'1.2-2' }}€</p>
                </div>
                <!-- Action buttons based on status -->
                <div class="flex flex-col gap-2 flex-shrink-0">
                  <button *ngIf="o.status === 'PENDING'"
                          (click)="updateOrderStatus(o.id, 'CONFIRMED')"
                          class="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors">
                    ✅ Accepter
                  </button>
                  <button *ngIf="o.status === 'CONFIRMED'"
                          (click)="updateOrderStatus(o.id, 'PREPARING')"
                          class="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                    👨‍🍳 En préparation
                  </button>
                  <button *ngIf="o.status === 'PREPARING'"
                          (click)="updateOrderStatus(o.id, 'READY')"
                          class="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                    🍽️ Prêt
                  </button>
                  <button *ngIf="o.status === 'PENDING'"
                          (click)="updateOrderStatus(o.id, 'CANCELLED')"
                          class="px-4 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors">
                    ❌ Refuser
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ── MENU TAB ── -->
          <div *ngIf="tab === 'menu'" class="space-y-4">
            <!-- Stock alerts banner -->
            <div *ngIf="stockAlerts().length > 0"
                 class="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <span class="text-2xl">⚠️</span>
              <div>
                <p class="font-semibold text-red-800">{{ stockAlerts().length }} alerte(s) de stock</p>
                <div class="flex flex-wrap gap-2 mt-1">
                  <span *ngFor="let a of stockAlerts()"
                        [class]="'text-xs px-2 py-0.5 rounded-full font-medium ' + (a.critical ? 'bg-red-200 text-red-800' : 'bg-orange-100 text-orange-800')">
                    {{ a.critical ? '🔴' : '🟡' }} {{ a.name }} ({{ a.stock }} restants)
                  </span>
                </div>
              </div>
            </div>

            <!-- Export CSV button -->
            <div class="flex justify-end">
              <button (click)="exportCsv()"
                      class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
                📥 Exporter CSV
              </button>
            </div>

            <div *ngIf="menuItems().length === 0" class="text-center py-12 text-gray-400">
              <p class="text-4xl mb-3">🍽️</p>
              <p>Aucun plat dans votre menu</p>
              <button (click)="tab = 'add'" class="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold">
                + Ajouter un plat
              </button>
            </div>

            <div *ngFor="let item of menuItems()"
                 class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div class="flex items-center gap-4">
                <img [src]="(item.imageUrl || item.image) | safeImg:'menu'"
                     [alt]="item.name" class="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <p class="font-semibold text-gray-900">{{ item.name }}</p>
                    <span *ngIf="item.popular" class="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">⭐ Populaire</span>
                    <span *ngIf="item.vegetarian" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">🌿 Végé</span>
                    <span *ngIf="item.happyHourDiscountPercent" class="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      🎉 -{{ item.happyHourDiscountPercent }}% Happy Hour
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mb-1">{{ item.category }}</p>
                  <div class="flex items-center gap-4">
                    <p class="font-bold text-orange-600">{{ item.price | number:'1.2-2' }}€</p>
                    <!-- Stock inline edit -->
                    <div class="flex items-center gap-2 text-xs">
                      <span class="text-gray-500">Stock:</span>
                      <input type="number" [value]="item.stockQuantity ?? '∞'"
                             (change)="updateStock(item.id, $any($event.target).value)"
                             class="w-16 px-2 py-0.5 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-orange-400"
                             min="0" placeholder="∞" />
                      <span *ngIf="item.stockQuantity === 0" class="text-red-600 font-semibold">Rupture!</span>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button (click)="editItem(item)"
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">✏️</button>
                  <button (click)="deleteItem(item.id)"
                          class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
                </div>
              </div>
            </div>
          </div>

          <!-- ── ADD/EDIT MENU ITEM TAB ── -->
          <div *ngIf="tab === 'add'" class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-5">
              {{ editingItem ? '✏️ Modifier le plat' : '➕ Ajouter un plat' }}
            </h3>
            <form (ngSubmit)="saveItem()" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Nom du plat *</label>
                  <input type="text" [(ngModel)]="itemForm.name" name="name" required
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Catégorie *</label>
                  <input type="text" [(ngModel)]="itemForm.category" name="category" placeholder="Entrées, Plats, Desserts..."
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea [(ngModel)]="itemForm.description" name="description" rows="2"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Prix (€) *</label>
                  <input type="number" [(ngModel)]="itemForm.price" name="price" step="0.01" min="0" required
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">URL Image</label>
                  <input type="url" [(ngModel)]="itemForm.imageUrl" name="imageUrl"
                         placeholder="https://..."
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div class="flex items-center gap-6">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" [(ngModel)]="itemForm.popular" name="popular" class="w-4 h-4 text-orange-500" />
                  <span class="text-sm font-medium text-gray-700">⭐ Populaire</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" [(ngModel)]="itemForm.vegetarian" name="vegetarian" class="w-4 h-4 text-green-500" />
                  <span class="text-sm font-medium text-gray-700">🌿 Végétarien</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" [(ngModel)]="itemForm.available" name="available" class="w-4 h-4 text-blue-500" />
                  <span class="text-sm font-medium text-gray-700">Disponible</span>
                </label>
              </div>
              <!-- Stock -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">📦 Stock (vide = illimité)</label>
                  <input type="number" [(ngModel)]="itemForm.stockQuantity" name="stockQuantity" min="0"
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">⚠️ Seuil alerte stock</label>
                  <input type="number" [(ngModel)]="itemForm.stockAlertThreshold" name="stockAlertThreshold" min="0"
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <!-- Happy Hour -->
              <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                <p class="text-sm font-semibold text-purple-800">🎉 Happy Hour (optionnel)</p>
                <p class="text-xs text-purple-600">Ex: de 14:00 à 16:00 → -20% sur ce plat pendant ces heures</p>
                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Réduction %</label>
                    <input type="number" [(ngModel)]="itemForm.happyHourDiscountPercent" name="hhDiscount" min="0" max="100"
                           class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Début (ex: 14:00)</label>
                    <input type="time" [(ngModel)]="itemForm.happyHourStart" name="hhStart"
                           class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Fin (ex: 16:00)</label>
                    <input type="time" [(ngModel)]="itemForm.happyHourEnd" name="hhEnd"
                           class="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                  </div>
                </div>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" (click)="cancelEdit()"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit" [disabled]="saving()"
                        class="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-60">
                  {{ saving() ? 'Enregistrement...' : (editingItem ? 'Modifier' : 'Ajouter') }}
                </button>
              </div>
              <p *ngIf="saveError" class="text-red-500 text-sm">{{ saveError }}</p>
            </form>
          </div>

          <!-- ── HOURS TAB ── -->
          <div *ngIf="tab === 'hours'" class="space-y-4">
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-5">🕐 Horaires d'ouverture</h3>
              <div class="space-y-3">
                <div *ngFor="let h of hoursForm" class="flex items-center gap-4">
                  <span class="w-28 text-sm font-semibold text-gray-700">{{ dayLabel(h.dayOfWeek) }}</span>
                  <label class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="h.closed" [name]="'closed_'+h.dayOfWeek" class="w-4 h-4" />
                    <span class="text-sm text-gray-600">Fermé</span>
                  </label>
                  <ng-container *ngIf="!h.closed">
                    <input type="time" [(ngModel)]="h.openTime" [name]="'open_'+h.dayOfWeek"
                           class="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <span class="text-gray-400">→</span>
                    <input type="time" [(ngModel)]="h.closeTime" [name]="'close_'+h.dayOfWeek"
                           class="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </ng-container>
                </div>
              </div>
              <button (click)="saveHours()" [disabled]="savingHours()"
                      class="mt-5 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-60">
                {{ savingHours() ? 'Enregistrement...' : '💾 Sauvegarder les horaires' }}
              </button>
            </div>
          </div>

          <!-- ── STATS TAB ── -->
          <div *ngIf="tab === 'stats'" class="space-y-6">
            <div *ngIf="loadingStats()" class="text-center py-8 text-gray-400">Chargement des statistiques...</div>
            <ng-container *ngIf="!loadingStats() && stats()">
              <!-- KPI Cards -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-white rounded-xl shadow-sm p-5 text-center">
                  <p class="text-3xl font-bold text-orange-600">{{ stats().totalOrders }}</p>
                  <p class="text-sm text-gray-500 mt-1">Commandes totales</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm p-5 text-center">
                  <p class="text-3xl font-bold text-green-600">{{ stats().totalRevenue | number:'1.2-2' }}€</p>
                  <p class="text-sm text-gray-500 mt-1">Chiffre d'affaires</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm p-5 text-center">
                  <p class="text-3xl font-bold text-blue-600">{{ stats().completionRate }}%</p>
                  <p class="text-sm text-gray-500 mt-1">Taux de livraison</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm p-5 text-center">
                  <p class="text-3xl font-bold text-red-500">{{ stats().cancelledOrders }}</p>
                  <p class="text-sm text-gray-500 mt-1">Annulations</p>
                </div>
              </div>
              <!-- Top plats -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h3 class="font-bold text-gray-900 mb-4">🏆 Top 5 plats commandés</h3>
                <div *ngIf="stats().topItems?.length === 0" class="text-gray-400 text-sm">Aucune donnée disponible</div>
                <div class="space-y-3">
                  <div *ngFor="let item of stats().topItems; let i = index" class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded-full bg-orange-100 text-orange-700 text-sm font-bold flex items-center justify-center">{{ i+1 }}</span>
                    <span class="flex-1 text-sm font-medium text-gray-800">{{ item.name }}</span>
                    <span class="text-sm font-bold text-orange-600">{{ item.count }}x</span>
                  </div>
                </div>
              </div>
              <!-- Badges -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h3 class="font-bold text-gray-900 mb-4">🏅 Badges obtenus</h3>
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let b of myRestaurant()!.badges"
                        class="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 text-sm font-semibold rounded-full border border-orange-200">
                    🏅 {{ b }}
                  </span>
                  <span *ngIf="!myRestaurant()!.badges?.length" class="text-gray-400 text-sm">Aucun badge pour l'instant</span>
                </div>
              </div>
            </ng-container>
          </div>

        </ng-container>
      </div>
    </div>
  `
})
export class RestaurantDashboardComponent implements OnInit {
  tab = 'orders';
  loading = signal(true);
  loadingOrders = signal(true);
  loadingStats = signal(false);
  saving = signal(false);
  savingHours = signal(false);
  myRestaurant = signal<Restaurant | null>(null);
  orders = signal<any[]>([]);
  menuItems = signal<any[]>([]);
  stats = signal<any>(null);
  editingItem: any = null;
  saveError = '';
  hoursForm: any[] = this.defaultHours();

  itemForm: any = this.emptyItemForm();

  pendingCount = () => this.orders().filter(o => o.status === 'PENDING').length;

  constructor(
    public auth: AuthService,
    private restaurantService: RestaurantService,
    private menuService: MenuService,
    private orderService: OrderService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading.set(true);
    // Find the restaurant owned by this user
    this.restaurantService.getAll().subscribe(restaurants => {
      const userId = this.auth.getUserId();
      const mine = restaurants.find(r => r.ownerId === userId) || null;
      this.myRestaurant.set(mine);
      this.loading.set(false);
      if (mine) {
        this.loadOrders(mine.id);
        this.loadMenu(mine.id);
      }
    });
  }

  loadOrders(restaurantId: string): void {
    this.loadingOrders.set(true);
    this.orderService.getByRestaurant(restaurantId).subscribe(data => {
      // Sort: PENDING first, then by date desc
      const sorted = data.sort((a: any, b: any) => {
        const priority: Record<string, number> = { PENDING: 0, CONFIRMED: 1, PREPARING: 2, READY: 3, ON_THE_WAY: 4, DELIVERED: 5, CANCELLED: 6 };
        return (priority[a.status] ?? 9) - (priority[b.status] ?? 9);
      });
      this.orders.set(sorted);
      this.loadingOrders.set(false);
    });
  }

  stockAlerts = signal<any[]>([]);

  loadMenu(restaurantId: string): void {
    this.menuService.getByRestaurant(restaurantId).subscribe(grouped => {
      const items = Object.values(grouped).flat();
      this.menuItems.set(items);
    });
    // Load stock alerts
    this.http.get<any[]>(`${API_BASE}/api/menus/restaurant/${restaurantId}/stock-alerts`).subscribe({
      next: alerts => this.stockAlerts.set(alerts),
      error: () => this.stockAlerts.set([])
    });
  }

  updateStock(itemId: string, quantity: string): void {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) return;
    this.http.patch<any>(`${API_BASE}/api/menus/manage/${itemId}/stock?quantity=${qty}`, null).subscribe({
      next: updated => {
        this.menuItems.update(list => list.map((i: any) => i.id === itemId ? { ...i, stockQuantity: updated.stockQuantity, available: updated.available } : i));
        const id = this.myRestaurant()?.id;
        if (id) this.http.get<any[]>(`${API_BASE}/api/menus/restaurant/${id}/stock-alerts`).subscribe(a => this.stockAlerts.set(a));
      }
    });
  }

  exportCsv(): void {
    const id = this.myRestaurant()?.id;
    if (!id) return;
    window.open(`${API_BASE}/api/menus/restaurant/${id}/export`, '_blank');
  }

  updateOrderStatus(orderId: number, status: string): void {
    this.orderService.updateStatus(orderId, status).subscribe(() => {
      this.orders.update(list => list.map(o => o.id === orderId ? { ...o, status } : o));
    });
  }

  editItem(item: any): void {
    this.editingItem = item;
    this.itemForm = { ...item };
    this.tab = 'add';
  }

  cancelEdit(): void {
    this.editingItem = null;
    this.itemForm = this.emptyItemForm();
    this.tab = 'menu';
  }

  saveItem(): void {
    const restaurantId = this.myRestaurant()?.id;
    if (!restaurantId) return;
    this.saving.set(true);
    this.saveError = '';
    const payload = { ...this.itemForm, restaurantId };

    const obs = this.editingItem
      ? this.menuService.update(this.editingItem.id, payload)
      : this.menuService.create(payload);

    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.editingItem = null;
        this.itemForm = this.emptyItemForm();
        this.tab = 'menu';
        this.loadMenu(restaurantId);
      },
      error: (err) => {
        this.saving.set(false);
        this.saveError = 'Erreur lors de l\'enregistrement';
      }
    });
  }

  deleteItem(id: string): void {
    if (!confirm('Supprimer ce plat ?')) return;
    this.menuService.delete(id).subscribe(() => {
      this.menuItems.update(list => list.filter((i: any) => i.id !== id));
    });
  }

  loadStats(): void {
    const id = this.myRestaurant()?.id;
    if (!id || this.stats()) return;
    this.loadingStats.set(true);
    this.http.get<any>(`${API_BASE}/api/restaurants/${id}/stats`).subscribe({
      next: data => { this.stats.set(data); this.loadingStats.set(false); },
      error: () => { this.stats.set({ totalOrders: 0, totalRevenue: 0, completionRate: 0, cancelledOrders: 0, topItems: [] }); this.loadingStats.set(false); }
    });
  }

  loadHours(): void {
    const id = this.myRestaurant()?.id;
    if (!id) return;
    this.http.get<any[]>(`${API_BASE}/api/restaurants/${id}/opening-hours`).subscribe({
      next: data => {
        if (data.length > 0) {
          this.hoursForm = this.defaultHours().map(def => {
            const found = data.find(h => h.dayOfWeek === def.dayOfWeek);
            return found ? { ...def, openTime: found.openTime, closeTime: found.closeTime, closed: found.closed } : def;
          });
        }
      },
      error: () => {}
    });
  }

  saveHours(): void {
    const id = this.myRestaurant()?.id;
    if (!id) return;
    this.savingHours.set(true);
    this.http.put<any[]>(`${API_BASE}/api/restaurants/${id}/opening-hours`, this.hoursForm).subscribe({
      next: () => this.savingHours.set(false),
      error: () => this.savingHours.set(false)
    });
  }

  dayLabel(day: string): string {
    const map: Record<string, string> = {
      MONDAY: 'Lundi', TUESDAY: 'Mardi', WEDNESDAY: 'Mercredi',
      THURSDAY: 'Jeudi', FRIDAY: 'Vendredi', SATURDAY: 'Samedi', SUNDAY: 'Dimanche'
    };
    return map[day] || day;
  }

  private defaultHours() {
    return ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'].map(day => ({
      dayOfWeek: day, openTime: '11:00', closeTime: '22:00', closed: day === 'SUNDAY'
    }));
  }

  tabClass(t: string): string {
    return 'px-5 py-3 font-semibold text-sm border-b-2 transition-colors ' +
      (this.tab === t ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700');
  }

  orderStatusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      CONFIRMED: 'bg-blue-100 text-blue-700',
      PREPARING: 'bg-purple-100 text-purple-700',
      READY: 'bg-orange-100 text-orange-700',
      ON_THE_WAY: 'bg-cyan-100 text-cyan-700',
      DELIVERED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  }

  orderStatusLabel(status: string): string {
    const map: Record<string, string> = {
      PENDING: '⏳ En attente', CONFIRMED: '✅ Acceptée', PREPARING: '👨‍🍳 En préparation',
      READY: '🍽️ Prête', ON_THE_WAY: '🛵 En route', DELIVERED: '✅ Livrée', CANCELLED: '❌ Annulée',
    };
    return map[status] || status;
  }

  private emptyItemForm() {
    return {
      name: '', description: '', price: 0, category: '', imageUrl: '',
      popular: false, vegetarian: false, available: true,
      stockQuantity: null, stockAlertThreshold: 5,
      happyHourDiscountPercent: null, happyHourStart: null, happyHourEnd: null
    };
  }
}
