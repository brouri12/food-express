import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { PromotionService } from '../../services/promotion.service';
import { RestaurantCardComponent } from '../../shared/restaurant-card/restaurant-card.component';
import { PromoCarouselComponent } from '../../shared/promo-carousel/promo-carousel.component';
import { Restaurant } from '../../models/restaurant.model';
import { Promotion } from '../../models/promotion.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, RestaurantCardComponent, PromoCarouselComponent],
  template: `
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div class="text-center fade-in">
          <h1 class="text-4xl md:text-6xl font-bold mb-4">
            Vos restaurants préférés,<br/>livrés en un clic 🍕
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-white/90">
            Découvrez les meilleurs restaurants près de chez vous
          </p>
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-2">
            <div class="flex items-center gap-2">
              <span class="text-gray-400 ml-3 text-xl">🔍</span>
              <input type="text" [(ngModel)]="searchQuery"
                     placeholder="Rechercher un restaurant ou un plat..."
                     (keydown.enter)="onSearch()"
                     class="flex-1 px-3 py-3 text-gray-900 outline-none bg-transparent" />
              <a [routerLink]="['/restaurants']" [queryParams]="{search: searchQuery}"
                 class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all whitespace-nowrap">
                Rechercher
              </a>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-center gap-2 text-white/80 text-sm">
            <span>📍</span><span>Livraison disponible dans toute la France</span>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

      <!-- Promo Carousel -->
      <app-promo-carousel [promotions]="promotions()"></app-promo-carousel>

      <!-- Catégories -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Catégories Populaires</h2>
          <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">API: Restaurant Service</span>
        </div>
        <div class="grid grid-cols-4 md:grid-cols-8 gap-3">
          <a *ngFor="let cat of categories" [routerLink]="['/restaurants']" [queryParams]="{category: cat.id}"
             class="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center hover:scale-105 duration-200">
            <div class="text-3xl md:text-4xl mb-2">{{ cat.icon }}</div>
            <p class="text-xs md:text-sm font-semibold text-gray-900 mb-1">{{ cat.name }}</p>
            <p class="text-xs text-gray-500">{{ cat.count }}</p>
          </a>
        </div>
      </section>

      <!-- Restaurants Recommandés -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Restaurants Recommandés</h2>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">API: Restaurant + Rating Service</span>
            <a routerLink="/restaurants" class="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1">
              Voir tout →
            </a>
          </div>
        </div>
        <div *ngIf="loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let i of [1,2,3]" class="bg-white rounded-xl shadow-md h-64 animate-pulse"></div>
        </div>
        <div *ngIf="!loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-restaurant-card *ngFor="let r of promoted()" [restaurant]="r"></app-restaurant-card>
        </div>
      </section>

      <!-- Nouveaux Restaurants -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Nouveaux Restaurants</h2>
          <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">API: Restaurant Service</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-restaurant-card *ngFor="let r of newRestaurants()" [restaurant]="r"></app-restaurant-card>
        </div>
      </section>

      <!-- CTA -->
      <section class="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 md:p-12 text-white text-center shadow-xl">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Livraison gratuite pour votre première commande ! 🎉</h2>
        <p class="text-lg md:text-xl mb-6 text-white/90">Inscrivez-vous et profitez de -20% avec le code BIENVENUE20</p>
        <a routerLink="/signup"
           class="inline-block bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg">
          Créer un compte
        </a>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  searchQuery = '';
  loading = signal(true);
  promoted = signal<Restaurant[]>([]);
  newRestaurants = signal<Restaurant[]>([]);
  promotions = signal<Promotion[]>([]);
  categories = this.restaurantService.getCategories();

  constructor(
    private restaurantService: RestaurantService,
    private promotionService: PromotionService
  ) {}

  ngOnInit(): void {
    this.restaurantService.getPromoted().subscribe(data => {
      this.promoted.set(data);
      this.loading.set(false);
    });
    this.restaurantService.getAll().subscribe(data => {
      this.newRestaurants.set(data.slice(0, 3));
    });
    this.promotionService.getAll().subscribe(data => {
      this.promotions.set(data);
    });
  }

  onSearch(): void {}
}
