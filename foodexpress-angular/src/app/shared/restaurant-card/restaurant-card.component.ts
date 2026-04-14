import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Restaurant } from '../../models/restaurant.model';
import { SafeImgPipe } from '../safe-img.pipe';

@Component({
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [CommonModule, RouterLink, SafeImgPipe],
  template: `
    <a [routerLink]="['/restaurant', restaurant.id]"
       class="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 duration-200 cursor-pointer">
      <div class="relative h-48 overflow-hidden">
        <img [src]="(restaurant.imageUrl || restaurant.image) | safeImg:'restaurant'"
             [alt]="restaurant.name"
             class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
        <div *ngIf="restaurant.promoted && restaurant.discount"
             class="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
          🏷️ -{{ restaurant.discount }}%
        </div>
        <div *ngIf="restaurant.promoted && !restaurant.discount"
             class="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          ⚡ Promu
        </div>
        <!-- Badges -->
        <div *ngIf="restaurant.badges?.length" class="absolute bottom-3 left-3 flex gap-1 flex-wrap">
          <span *ngFor="let b of restaurant.badges?.slice(0,2)"
                class="bg-white/90 text-gray-800 px-2 py-0.5 rounded-full text-xs font-semibold">
            🏅 {{ b }}
          </span>
        </div>
      </div>
      <div class="p-4">
        <h3 class="font-bold text-lg mb-1 text-gray-900">{{ restaurant.name }}</h3>
        <p class="text-gray-600 text-sm mb-3">{{ restaurant.cuisine }}</p>
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-1 text-yellow-500">
            <span>⭐</span>
            <span class="font-semibold text-gray-900">{{ restaurant.rating }}</span>
            <span class="text-gray-500">({{ restaurant.ratingCount }})</span>
          </div>
          <div class="flex items-center gap-1 text-gray-600">
            <span>🕐</span>
            <span>{{ restaurant.deliveryTime }} min</span>
          </div>
        </div>
        <div class="mt-2 pt-2 border-t border-gray-100 text-sm text-gray-600">
          Livraison : {{ restaurant.deliveryFee | number:'1.2-2' }}€
        </div>
      </div>
    </a>
  `
})
export class RestaurantCardComponent {
  @Input({ required: true }) restaurant!: Restaurant;
}
