import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { RestaurantCardComponent } from '../../shared/restaurant-card/restaurant-card.component';
import { Restaurant } from '../../models/restaurant.model';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule, RestaurantCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Tous les restaurants</h1>
              <div class="flex items-center gap-2">
                <span>📍</span><p class="text-gray-600">Paris, France</p>
                <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full ml-2">API: Restaurant Service</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button (click)="showFilters = !showFilters"
                      [class]="'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ' + (showFilters ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-700')">
                ⚙️ Filtres
              </button>
              <select [(ngModel)]="sortBy" (ngModelChange)="applySort()"
                      class="px-4 py-2 border-2 border-gray-200 rounded-lg font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="recommended">Recommandés</option>
                <option value="rating">Note</option>
                <option value="deliveryTime">Temps de livraison</option>
              </select>
            </div>
          </div>

          <!-- Search -->
          <div class="mt-6 relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearch($event)"
                   placeholder="Rechercher un restaurant..."
                   class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>

          <!-- Categories -->
          <div class="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button (click)="selectCategory(null)"
                    [class]="'px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ' + (!selectedCategory ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')">
              Tous
            </button>
            <button *ngFor="let cat of categories"
                    (click)="selectCategory(cat.name)"
                    [class]="'flex items-center gap-2 px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ' + (selectedCategory === cat.name ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')">
              {{ cat.icon }} {{ cat.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Filters Panel -->
      <div *ngIf="showFilters" class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Note minimale</label>
              <select [(ngModel)]="minRating" (ngModelChange)="applyFilters()"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option [value]="0">Toutes les notes</option>
                <option [value]="4">4+ ⭐</option>
                <option [value]="4.5">4.5+ ⭐</option>
              </select>
            </div>
            <div class="flex items-end">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="promotedOnly" (ngModelChange)="applyFilters()"
                       class="w-5 h-5 text-orange-500 border-gray-300 rounded" />
                <span class="font-semibold text-gray-700">Promotions uniquement</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p class="text-gray-600 mb-6">
          <span class="font-semibold text-gray-900">{{ filtered().length }}</span>
          restaurant{{ filtered().length > 1 ? 's' : '' }} trouvé{{ filtered().length > 1 ? 's' : '' }}
        </p>

        <div *ngIf="loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let i of [1,2,3,4,5,6]" class="bg-white rounded-xl shadow-md h-64 animate-pulse"></div>
        </div>

        <div *ngIf="!loading() && filtered().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-restaurant-card *ngFor="let r of filtered()" [restaurant]="r"></app-restaurant-card>
        </div>

        <div *ngIf="!loading() && filtered().length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">😔</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Aucun restaurant trouvé</h3>
          <p class="text-gray-600">Essayez de modifier vos filtres ou votre recherche</p>
        </div>
      </div>
    </div>
  `
})
export class RestaurantsComponent implements OnInit {
  loading = signal(true);
  all = signal<Restaurant[]>([]);
  filtered = signal<Restaurant[]>([]);
  categories = this.restaurantService.getCategories();

  searchQuery = '';
  selectedCategory: string | null = null;
  sortBy = 'recommended';
  showFilters = false;
  minRating = 0;
  promotedOnly = false;

  constructor(private restaurantService: RestaurantService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['search']) this.searchQuery = params['search'];
      if (params['category']) {
        const cat = this.categories.find(c => c.id === params['category']);
        if (cat) this.selectedCategory = cat.name;
      }
    });

    this.restaurantService.getAll().subscribe(data => {
      this.all.set(data);
      this.applyFilters();
      this.loading.set(false);
    });
  }

  onSearch(query: string): void {
    if (query.length > 2) {
      this.restaurantService.search(query).subscribe(data => {
        this.all.set(data);
        this.applyFilters();
      });
    } else if (query.length === 0) {
      this.restaurantService.getAll().subscribe(data => {
        this.all.set(data);
        this.applyFilters();
      });
    }
  }

  selectCategory(cat: string | null): void {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  applySort(): void { this.applyFilters(); }

  applyFilters(): void {
    let result = [...this.all()];
    if (this.selectedCategory) result = result.filter(r => r.categories.includes(this.selectedCategory!));
    if (this.minRating > 0) result = result.filter(r => r.rating >= this.minRating);
    if (this.promotedOnly) result = result.filter(r => r.promoted);
    if (this.sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (this.sortBy === 'deliveryTime') result.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
    this.filtered.set(result);
  }
}
