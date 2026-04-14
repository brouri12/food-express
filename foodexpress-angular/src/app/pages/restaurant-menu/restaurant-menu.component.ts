import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { Restaurant } from '../../models/restaurant.model';
import { MenuItem } from '../../models/menu.model';

@Component({
  selector: 'app-restaurant-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50" *ngIf="restaurant()">
      <!-- Toast -->
      <div *ngIf="showToast"
           class="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 fade-in">
        🛒 Ajouté au panier !
      </div>

      <!-- Hero Image -->
      <div class="relative h-64 md:h-80 bg-gray-900">
        <img [src]="restaurant()!.image" [alt]="restaurant()!.name"
             class="w-full h-full object-cover opacity-80" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <a routerLink="/restaurants"
           class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white transition-all">
          ← Retour
        </a>
        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div class="max-w-7xl mx-auto">
            <span *ngIf="restaurant()!.promoted && restaurant()!.discount"
                  class="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-3">
              🔥 -{{ restaurant()!.discount }}% de réduction
            </span>
            <h1 class="text-3xl md:text-4xl font-bold mb-3">{{ restaurant()!.name }}</h1>
            <div class="flex flex-wrap items-center gap-4 text-sm md:text-base">
              <div class="flex items-center gap-1">
                ⭐ <span class="font-semibold">{{ restaurant()!.rating }}</span>
                <span class="text-white/80">({{ restaurant()!.ratingCount }} avis)</span>
              </div>
              <div class="flex items-center gap-1 text-white/90">
                🕐 {{ restaurant()!.deliveryTime }} min
              </div>
              <div class="flex items-center gap-1 text-white/90">
                📍 Livraison : {{ restaurant()!.deliveryFee | number:'1.2-2' }}€
              </div>
            </div>
            <p class="mt-2 text-white/80">{{ restaurant()!.description }}</p>
          </div>
        </div>
      </div>

      <!-- Category Nav -->
      <div class="sticky top-16 bg-white border-b border-gray-200 z-40 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">API: Menu Service</span>
            <button (click)="selectedCat = null"
                    [class]="'px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ' + (!selectedCat ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700')">
              Tout le menu
            </button>
            <button *ngFor="let cat of menuCategories()"
                    (click)="selectedCat = cat"
                    [class]="'px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ' + (selectedCat === cat ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700')">
              {{ cat }}
            </button>
          </div>
          <div class="pb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text"
                   [(ngModel)]="searchQuery"
                   placeholder="Rechercher un plat..."
                   class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <select [(ngModel)]="sortBy"
                    class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="default">Tri par défaut</option>
              <option value="nameAsc">Nom A-Z</option>
              <option value="priceAsc">Prix croissant</option>
              <option value="priceDesc">Prix décroissant</option>
            </select>
            <label class="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" [(ngModel)]="onlyAvailable" class="rounded border-gray-300 text-orange-500" />
              Afficher seulement les plats disponibles
            </label>
          </div>
        </div>
      </div>

      <!-- Menu Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Items -->
          <div class="lg:col-span-2 space-y-8">
            <div *ngIf="displayedMenu().length === 0"
                 class="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <p class="text-lg font-semibold text-gray-800 mb-2">Aucun plat trouvé</p>
              <p class="text-gray-600 mb-4">Essayez une autre recherche ou réinitialisez les filtres.</p>
              <button type="button" (click)="resetFilters()"
                      class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                Réinitialiser les filtres
              </button>
            </div>
            <ng-container *ngFor="let entry of displayedMenu()">
              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">
                  {{ entry.category }}
                  <span class="ml-2 text-sm font-medium text-gray-500">({{ entry.items.length }} plats)</span>
                </h2>
                <div class="space-y-4">
                  <div *ngFor="let item of entry.items"
                       [class]="'bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all ' + (!item.available ? 'opacity-60' : '')">
                    <div class="flex gap-4 p-4">
                      <div class="flex-1">
                        <div class="flex items-start gap-2 mb-2">
                          <h4 class="font-semibold text-gray-900 flex-1">{{ item.name }}</h4>
                          <span *ngIf="item.popular" class="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">⭐ Populaire</span>
                          <span *ngIf="item.vegetarian" class="text-green-600 text-sm">🌿</span>
                        </div>
                        <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ item.description }}</p>
                        <div class="flex items-center justify-between">
                          <span class="font-bold text-lg text-gray-900">{{ item.price | number:'1.2-2' }}€</span>
                          <button *ngIf="item.available" (click)="addToCart(item)"
                                  class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-md">
                            +
                          </button>
                          <span *ngIf="!item.available" class="text-gray-400 text-sm">Indisponible</span>
                        </div>
                      </div>
                      <div class="w-24 h-24 flex-shrink-0">
                        <img [src]="item.image || item.imageUrl" [alt]="item.name"
                             class="w-full h-full object-cover rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ng-container>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-sm p-6 sticky top-40">
              <h3 class="font-bold text-gray-900 mb-4">ℹ️ Informations</h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Commande minimum</span>
                  <span class="font-semibold">{{ restaurant()!.minOrder }}€</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Frais de livraison</span>
                  <span class="font-semibold">{{ restaurant()!.deliveryFee | number:'1.2-2' }}€</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Temps de livraison</span>
                  <span class="font-semibold">{{ restaurant()!.deliveryTime }} min</span>
                </div>
              </div>
              <a *ngIf="cartCount() > 0" routerLink="/cart"
                 class="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md flex items-center justify-center gap-2 block text-center">
                🛒 Voir le panier ({{ cartCount() }})
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div *ngIf="!restaurant()" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Chargement...</p>
      </div>
    </div>
  `
})
export class RestaurantMenuComponent implements OnInit {
  restaurant = signal<Restaurant | null>(null);
  menuData = signal<Record<string, MenuItem[]>>({});
  selectedCat: string | null = null;
  searchQuery = '';
  onlyAvailable = false;
  sortBy: 'default' | 'nameAsc' | 'priceAsc' | 'priceDesc' = 'default';
  showToast = false;
  cartCount = this.cart.count;

  menuCategories = () => Object.keys(this.menuData());

  displayedMenu = () => {
    const data = this.menuData();
    const cats = this.selectedCat ? [this.selectedCat] : Object.keys(data);
    const query = this.searchQuery.trim().toLowerCase();
    return cats
      .map(cat => {
        let items = [...(data[cat] || [])];
        if (this.onlyAvailable) {
          items = items.filter(item => item.available);
        }
        if (query) {
          items = items.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
          );
        }
        if (this.sortBy === 'nameAsc') {
          items.sort((a, b) => a.name.localeCompare(b.name));
        }
        if (this.sortBy === 'priceAsc') {
          items.sort((a, b) => a.price - b.price);
        }
        if (this.sortBy === 'priceDesc') {
          items.sort((a, b) => b.price - a.price);
        }
        return { category: cat, items };
      })
      .filter(entry => entry.items.length > 0);
  };

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private menuService: MenuService,
    private cart: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.restaurantService.getById(id).subscribe(r => this.restaurant.set(r));
    this.menuService.getByRestaurant(id).subscribe(data => this.menuData.set(data));
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.onlyAvailable = false;
    this.sortBy = 'default';
    this.selectedCat = null;
  }

  addToCart(item: MenuItem): void {
    const r = this.restaurant()!;
    this.cart.add({
      id: item.id,
      restaurantId: r.id,
      restaurantName: r.name,
      name: item.name,
      price: item.price,
      image: item.image || item.imageUrl || '',
    });
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }
}
