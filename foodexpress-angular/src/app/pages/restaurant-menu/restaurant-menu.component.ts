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
    <div class="min-h-screen bg-gray-50" *ngIf="restaurant() && !loading">
      <!-- Toast -->
      <div *ngIf="showToast"
           class="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 fade-in">
        🛒 {{ toastMessage }}
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
            <button (click)="selectCategory(null)"
                    [class]="'px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ' + (!selectedCat ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700')">
              Tout le menu
            </button>
            <button *ngFor="let cat of menuCategories(); trackBy: trackByCategory"
                    (click)="selectCategory(cat)"
                    [class]="'px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ' + (selectedCat === cat ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700')">
              {{ cat }}
            </button>
            <button type="button" (click)="expandAllCategories()"
                    class="px-3 py-2 rounded-full font-semibold whitespace-nowrap transition-all bg-gray-100 text-gray-700 hover:bg-gray-200">
              Tout déplier
            </button>
          </div>
          <div class="pb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="relative">
              <input type="text"
                     [(ngModel)]="searchQuery"
                     (ngModelChange)="onFiltersChange()"
                     (keydown)="onSearchKeyDown($event)"
                     placeholder="Rechercher un plat..."
                     aria-label="Rechercher un plat du menu"
                     class="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <button *ngIf="searchQuery.trim()" type="button" (click)="clearSearch()"
                      class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full text-gray-500 hover:bg-gray-100">
                ✕
              </button>
            </div>
            <select [(ngModel)]="sortBy"
                    (ngModelChange)="onFiltersChange()"
                    aria-label="Trier les plats"
                    class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="default">Tri par défaut</option>
              <option value="nameAsc">Nom A-Z</option>
              <option value="priceAsc">Prix croissant</option>
              <option value="priceDesc">Prix décroissant</option>
            </select>
            <label class="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" [(ngModel)]="onlyAvailable" (ngModelChange)="onFiltersChange()" aria-label="Afficher seulement les plats disponibles" class="rounded border-gray-300 text-orange-500" />
              Afficher seulement les plats disponibles
            </label>
          </div>
          <p class="pb-4 text-xs text-gray-500">Astuce: appuyez sur Echap dans la recherche pour effacer rapidement.</p>
          <div class="pb-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div class="text-sm text-gray-700">
              Prix max: <span class="font-semibold">{{ maxPrice }}€</span>
              <button type="button" (click)="resetMaxPrice()" class="ml-2 text-xs text-orange-600 hover:text-orange-700">Reset</button>
            </div>
            <input type="range" min="5" max="80" step="1" [(ngModel)]="maxPrice"
                   (ngModelChange)="onFiltersChange()"
                   aria-label="Filtrer par prix maximum"
                   class="w-full accent-orange-500" />
            <div class="flex items-center gap-2">
              <button type="button" (click)="onlyVegetarian = !onlyVegetarian; onFiltersChange()"
                      [class]="'px-3 py-1 rounded-full text-sm font-semibold transition-colors ' + (onlyVegetarian ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700')">
                🌿 Végétarien
              </button>
              <button type="button" (click)="onlyPopular = !onlyPopular; onFiltersChange()"
                      [class]="'px-3 py-1 rounded-full text-sm font-semibold transition-colors ' + (onlyPopular ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700')">
                ⭐ Populaire
              </button>
            </div>
          </div>
          <div class="pb-4 flex flex-wrap items-center gap-2" *ngIf="hasActiveFilters()">
            <span class="text-xs text-gray-500">Filtres actifs :</span>
            <span *ngIf="selectedCat" class="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">Catégorie: {{ selectedCat }}</span>
            <span *ngIf="searchQuery.trim()" class="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">Recherche: "{{ searchQuery }}"</span>
            <span *ngIf="onlyAvailable" class="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">Disponibles</span>
            <button *ngIf="onlyVegetarian" type="button" (click)="onlyVegetarian = false; onFiltersChange()" class="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs hover:bg-gray-200">Végétarien ✕</button>
            <button *ngIf="onlyPopular" type="button" (click)="onlyPopular = false; onFiltersChange()" class="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs hover:bg-gray-200">Populaire ✕</button>
            <span *ngIf="maxPrice < 80" class="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">Prix ≤ {{ maxPrice }}€</span>
            <span *ngIf="sortBy !== 'default'" class="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">Tri: {{ sortLabel() }}</span>
            <button type="button" (click)="resetFilters()"
                    class="ml-1 px-2 py-1 rounded-full text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50">
              Tout effacer
            </button>
          </div>
          <p *ngIf="hasActiveFilters()" class="pb-3 text-xs text-gray-500">{{ filtersSummary() }}</p>
        </div>
      </div>

      <!-- Menu Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Items -->
          <div class="lg:col-span-2 space-y-8">
            <p class="text-sm text-gray-500">Résultats : {{ resultsText() }}</p>
            <div *ngIf="displayedMenu().length === 0"
                 class="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <p class="text-lg font-semibold text-gray-800 mb-2">Aucun plat trouvé</p>
              <p class="text-gray-600 mb-4">Essayez une autre recherche ou réinitialisez les filtres.</p>
              <button type="button" (click)="resetFilters()"
                      class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                Réinitialiser les filtres
              </button>
            </div>
            <ng-container *ngFor="let entry of pagedDisplayedMenu(); trackBy: trackByEntryCategory">
              <div>
                <button type="button" (click)="toggleCategory(entry.category)"
                        class="w-full text-left flex items-center justify-between mb-4">
                  <h2 class="text-2xl font-bold text-gray-900">
                    {{ entry.category }}
                    <span class="ml-2 text-sm font-medium text-gray-500">({{ entry.items.length }} plats)</span>
                  </h2>
                  <span class="text-gray-500 text-xl">{{ isCategoryCollapsed(entry.category) ? '▸' : '▾' }}</span>
                </button>
                <div class="space-y-4" *ngIf="!isCategoryCollapsed(entry.category)">
                  <div *ngFor="let item of entry.items; trackBy: trackByItemId"
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
                          <div *ngIf="item.available" class="flex items-center gap-2">
                            <button type="button" (click)="changeDraftQty(item.id, -1)"
                                    [disabled]="getDraftQty(item.id) <= 1"
                                    class="w-8 h-8 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">-</button>
                            <span class="w-6 text-center text-sm font-semibold">{{ getDraftQty(item.id) }}</span>
                            <button type="button" (click)="changeDraftQty(item.id, 1)"
                                    class="w-8 h-8 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">+</button>
                            <button (click)="addToCart(item)"
                                    class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-md text-sm font-semibold">
                              Ajouter
                            </button>
                          </div>
                          <span *ngIf="!item.available" class="text-gray-400 text-sm">Indisponible</span>
                        </div>
                      </div>
                      <div class="w-24 h-24 flex-shrink-0">
                        <img [src]="item.image || item.imageUrl || 'https://via.placeholder.com/96x96?text=Plat'" [alt]="item.name"
                             class="w-full h-full object-cover rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ng-container>
            <div *ngIf="totalPages() > 1" class="flex items-center justify-center gap-3 pt-2">
              <button type="button" (click)="goToPreviousPage()" [disabled]="page <= 1"
                      class="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-40">
                Précédent
              </button>
              <span class="text-sm text-gray-600">Page {{ page }} / {{ totalPages() }}</span>
              <button type="button" (click)="goToNextPage()" [disabled]="page >= totalPages()"
                      class="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-40">
                Suivant
              </button>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-sm p-6 sticky top-40">
              <h3 class="font-bold text-gray-900 mb-4">ℹ️ Informations</h3>
              <div class="flex items-center justify-between mb-3">
                <p class="text-xs text-gray-500">Cache menu: {{ cacheSize() }} restaurant(s)</p>
                <button type="button" (click)="clearMenuCache()"
                        class="text-xs text-orange-600 hover:text-orange-700 font-semibold">
                  Vider cache
                </button>
              </div>
              <p class="text-[11px] text-gray-400 mb-2">État courant: {{ currentRestaurantCacheState() }}</p>
              <p *ngIf="cachedIdsPreview()" class="text-[11px] text-gray-400 mb-3">
                IDs en cache: {{ cachedIdsPreview() }}
              </p>
              <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="bg-orange-50 rounded-lg p-3 text-center">
                  <p class="text-xs text-gray-500">Plats visibles</p>
                  <p class="text-lg font-bold text-orange-600">{{ visibleItemsCount() }}</p>
                </div>
                <div class="bg-blue-50 rounded-lg p-3 text-center">
                  <p class="text-xs text-gray-500">Prix moyen</p>
                  <p class="text-lg font-bold text-blue-600">{{ averageVisiblePrice() | number:'1.2-2' }}€</p>
                </div>
              </div>
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
          <div class="pb-4 flex items-center gap-2 flex-wrap">
            <span class="text-xs text-gray-500">Raccourcis prix :</span>
            <button type="button" (click)="applyMaxPrice(15)" class="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700 hover:bg-gray-200">≤ 15€</button>
            <button type="button" (click)="applyMaxPrice(25)" class="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700 hover:bg-gray-200">≤ 25€</button>
            <button type="button" (click)="applyMaxPrice(40)" class="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700 hover:bg-gray-200">≤ 40€</button>
          </div>
        </div>
      </div>

      <button type="button" (click)="scrollToTop()"
              class="fixed bottom-20 md:bottom-6 right-4 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md text-gray-700 hover:bg-gray-50">
        ↑
      </button>
    </div>

    <!-- Loading -->
    <div *ngIf="loading" class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
        <div class="h-64 md:h-80 rounded-2xl bg-gray-200"></div>
        <div class="h-12 rounded-xl bg-gray-200"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-4">
            <div class="h-32 rounded-xl bg-gray-200"></div>
            <div class="h-32 rounded-xl bg-gray-200"></div>
            <div class="h-32 rounded-xl bg-gray-200"></div>
          </div>
          <div class="h-64 rounded-xl bg-gray-200"></div>
        </div>
      </div>
    </div>
  `
})
export class RestaurantMenuComponent implements OnInit {
  private readonly MENU_FILTERS_KEY = 'fe_menu_filters_v1';
  private currentRestaurantId = '';
  restaurant = signal<Restaurant | null>(null);
  menuData = signal<Record<string, MenuItem[]>>({});
  selectedCat: string | null = null;
  searchQuery = '';
  onlyAvailable = false;
  onlyVegetarian = false;
  onlyPopular = false;
  maxPrice = 80;
  sortBy: 'default' | 'nameAsc' | 'priceAsc' | 'priceDesc' = 'default';
  collapsedCategories = signal<Record<string, boolean>>({});
  draftQty = signal<Record<string, number>>({});
  loading = true;
  page = 1;
  readonly categoriesPerPage = 2;
  showToast = false;
  toastMessage = 'Ajouté au panier !';
  cartCount = this.cart.count;

  menuCategories = () => Object.keys(this.menuData());
  visibleItemsCount = () => this.displayedMenu().reduce((acc, entry) => acc + entry.items.length, 0);
  resultsText = () => {
    const count = this.visibleItemsCount();
    return count > 1 ? `${count} plats` : `${count} plat`;
  };
  averageVisiblePrice = () => {
    const items = this.displayedMenu().flatMap(entry => entry.items);
    if (items.length === 0) return 0;
    const total = items.reduce((acc, item) => acc + item.price, 0);
    return total / items.length;
  };
  cacheSize = () => this.menuService.getCacheSize();
  cachedIdsPreview = () => this.menuService.getCachedRestaurantIds().slice(0, 3).join(', ');
  currentRestaurantCacheState = () =>
    this.currentRestaurantId && this.menuService.hasCachedRestaurant(this.currentRestaurantId) ? 'cache hit' : 'cache miss';
  hasActiveFilters = () =>
    !!this.selectedCat ||
    !!this.searchQuery.trim() ||
    this.onlyAvailable ||
    this.onlyVegetarian ||
    this.onlyPopular ||
    this.maxPrice < 80 ||
    this.sortBy !== 'default';
  sortLabel = () => {
    if (this.sortBy === 'nameAsc') return 'Nom A-Z';
    if (this.sortBy === 'priceAsc') return 'Prix croissant';
    if (this.sortBy === 'priceDesc') return 'Prix décroissant';
    return 'Défaut';
  };
  filtersSummary = () => `Vue filtrée: ${this.resultsText()} sur ${this.totalItemsCount()} éléments`;
  isCategoryCollapsed = (category: string) => !!this.collapsedCategories()[category];
  totalPages = () => Math.max(1, Math.ceil(this.displayedMenu().length / this.categoriesPerPage));
  totalItemsCount = () => Object.values(this.menuData()).reduce((acc, items) => acc + items.length, 0);
  pagedDisplayedMenu = () => {
    const start = (this.page - 1) * this.categoriesPerPage;
    return this.displayedMenu().slice(start, start + this.categoriesPerPage);
  };

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
        if (this.onlyVegetarian) {
          items = items.filter(item => item.vegetarian);
        }
        if (this.onlyPopular) {
          items = items.filter(item => item.popular);
        }
        items = items.filter(item => item.price <= this.maxPrice);
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
    this.restoreFilters();
    const id = this.route.snapshot.paramMap.get('id')!;
    this.currentRestaurantId = id;
    this.restaurantService.getById(id).subscribe(r => this.restaurant.set(r));
    this.menuService.getByRestaurant(id).subscribe(data => {
      this.menuData.set(data);
      this.ensurePageInBounds();
      this.loading = false;
    });
  }

  onSearchKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.clearSearch();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onFiltersChange();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.onlyAvailable = false;
    this.onlyVegetarian = false;
    this.onlyPopular = false;
    this.maxPrice = 80;
    this.sortBy = 'default';
    this.selectedCat = null;
    this.page = 1;
    this.saveFilters();
  }

  selectCategory(category: string | null): void {
    this.selectedCat = category;
    this.page = 1;
    this.saveFilters();
  }

  goToPreviousPage(): void {
    this.page = Math.max(1, this.page - 1);
    this.ensurePageInBounds();
  }

  goToNextPage(): void {
    this.page = Math.min(this.totalPages(), this.page + 1);
    this.ensurePageInBounds();
  }

  trackByCategory = (_: number, category: string): string => category;
  trackByEntryCategory = (_: number, entry: { category: string }): string => entry.category;
  trackByItemId = (_: number, item: MenuItem): string => item.id;

  toggleCategory(category: string): void {
    const current = this.collapsedCategories();
    this.collapsedCategories.set({
      ...current,
      [category]: !current[category]
    });
  }

  expandAllCategories(): void {
    this.collapsedCategories.set({});
  }

  getDraftQty(itemId: string): number {
    return this.draftQty()[itemId] || 1;
  }

  changeDraftQty(itemId: string, delta: number): void {
    const current = this.getDraftQty(itemId);
    const next = Math.max(1, current + delta);
    this.draftQty.set({ ...this.draftQty(), [itemId]: next });
  }

  onFiltersChange(): void {
    this.page = 1;
    this.ensurePageInBounds();
    this.saveFilters();
  }

  clearMenuCache(): void {
    this.menuService.clearMenuCache();
  }

  private ensurePageInBounds(): void {
    this.page = Math.max(1, Math.min(this.page, this.totalPages()));
  }

  applyMaxPrice(value: number): void {
    this.maxPrice = value;
    this.onFiltersChange();
  }

  resetMaxPrice(): void {
    this.maxPrice = 80;
    this.onFiltersChange();
  }

  addToCart(item: MenuItem): void {
    const r = this.restaurant()!;
    const qty = this.getDraftQty(item.id);
    for (let i = 0; i < qty; i++) {
      this.cart.add({
        id: item.id,
        restaurantId: r.id,
        restaurantName: r.name,
        name: item.name,
        price: item.price,
        image: item.image || item.imageUrl || '',
      });
    }
    this.toastMessage = qty > 1 ? `${qty}x ${item.name} ajoutés au panier` : `${item.name} ajouté au panier`;
    this.draftQty.set({ ...this.draftQty(), [item.id]: 1 });
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  private saveFilters(): void {
    sessionStorage.setItem(this.MENU_FILTERS_KEY, JSON.stringify({
      selectedCat: this.selectedCat,
      searchQuery: this.searchQuery,
      onlyAvailable: this.onlyAvailable,
      onlyVegetarian: this.onlyVegetarian,
      onlyPopular: this.onlyPopular,
      maxPrice: this.maxPrice,
      sortBy: this.sortBy
    }));
  }

  private restoreFilters(): void {
    const raw = sessionStorage.getItem(this.MENU_FILTERS_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as {
        selectedCat: string | null;
        searchQuery: string;
        onlyAvailable: boolean;
        onlyVegetarian: boolean;
        onlyPopular: boolean;
        maxPrice: number;
        sortBy: 'default' | 'nameAsc' | 'priceAsc' | 'priceDesc';
      };
      this.selectedCat = saved.selectedCat ?? null;
      this.searchQuery = saved.searchQuery ?? '';
      this.onlyAvailable = !!saved.onlyAvailable;
      this.onlyVegetarian = !!saved.onlyVegetarian;
      this.onlyPopular = !!saved.onlyPopular;
      this.maxPrice = typeof saved.maxPrice === 'number'
        ? Math.min(80, Math.max(5, saved.maxPrice))
        : 80;
      this.sortBy = saved.sortBy ?? 'default';
    } catch {
      sessionStorage.removeItem(this.MENU_FILTERS_KEY);
    }
  }
}
