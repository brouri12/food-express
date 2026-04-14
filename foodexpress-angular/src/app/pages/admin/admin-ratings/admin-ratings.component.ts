import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingService } from '../../../services/rating.service';
import { Rating } from '../../../models/rating.model';
import { RestaurantService } from '../../../services/restaurant.service';

@Component({
  selector: 'app-admin-ratings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">⭐ Gestion des Avis</h2>
          <p class="text-gray-500 text-sm mt-1">API: rating-service → GET/DELETE /api/ratings</p>
        </div>
        <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {{ allRatings().length }} avis au total
        </span>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-400">
          <p class="text-3xl font-bold text-gray-900">{{ allRatings().length }}</p>
          <p class="text-gray-500 text-sm mt-1">Total des avis</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-400">
          <p class="text-3xl font-bold text-gray-900">{{ globalAverage() | number:'1.1-1' }}</p>
          <p class="text-gray-500 text-sm mt-1">Note moyenne globale</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-orange-400">
          <p class="text-3xl font-bold text-gray-900">{{ fiveStarCount() }}</p>
          <p class="text-gray-500 text-sm mt-1">Avis 5 étoiles ⭐⭐⭐⭐⭐</p>
        </div>
      </div>

      <!-- Filter by restaurant -->
      <div class="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
        <label class="text-sm font-semibold text-gray-700">Filtrer par restaurant :</label>
        <select [(ngModel)]="selectedRestaurantId" (ngModelChange)="filterByRestaurant($event)"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                [ngModel]="selectedRestaurantId">
          <option value="">Tous les restaurants</option>
          <option *ngFor="let r of restaurants()" [value]="r.id">{{ r.name }}</option>
        </select>
      </div>

      <!-- Ratings table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Restaurant</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Note</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Commentaire</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Utilisateur</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let r of filteredRatings()" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <p class="font-semibold text-gray-900 text-sm">{{ getRestaurantName(r.restaurantId) }}</p>
                <p class="text-xs text-gray-400">{{ r.restaurantId }}</p>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1">
                  <span *ngFor="let s of [1,2,3,4,5]; let i=index"
                        [class.text-yellow-400]="i < r.note"
                        [class.text-gray-300]="i >= r.note"
                        class="text-lg">★</span>
                  <span class="text-sm font-semibold text-gray-700 ml-1">{{ r.note }}/5</span>
                </div>
              </td>
              <td class="px-6 py-4 max-w-xs">
                <p class="text-sm text-gray-700 truncate">{{ r.commentaire || '—' }}</p>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ r.userId }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ r.dateCreation | date:'dd/MM/yy HH:mm' }}</td>
              <td class="px-6 py-4">
                <button (click)="deleteRating(r)"
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="loading()" class="p-8 text-center text-gray-500">Chargement...</div>
        <div *ngIf="!loading() && filteredRatings().length === 0" class="p-8 text-center text-gray-400">
          <div class="text-4xl mb-2">⭐</div>
          <p>Aucun avis trouvé</p>
        </div>
      </div>
    </div>
  `
})
export class AdminRatingsComponent implements OnInit {
  allRatings = signal<Rating[]>([]);
  filteredRatings = signal<Rating[]>([]);
  restaurants = signal<any[]>([]);
  loading = signal(true);
  selectedRestaurantId = '';

  globalAverage = () => {
    const r = this.allRatings();
    if (!r.length) return 0;
    return r.reduce((s, x) => s + x.note, 0) / r.length;
  };

  fiveStarCount = () => this.allRatings().filter(r => r.note === 5).length;

  constructor(
    private ratingService: RatingService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.restaurantService.getAll().subscribe(r => this.restaurants.set(r));
    this.loadAllRatings();
  }

  loadAllRatings(): void {
    // Load ratings for all seeded restaurants
    const ids = ['rest-001', 'rest-002', 'rest-003', 'rest-004', 'rest-005', 'rest-006'];
    const all: Rating[] = [];
    let done = 0;
    ids.forEach(id => {
      this.ratingService.getRatingsByRestaurant(id).subscribe(ratings => {
        all.push(...ratings);
        done++;
        if (done === ids.length) {
          this.allRatings.set(all.sort((a, b) =>
            new Date(b.dateCreation || '').getTime() - new Date(a.dateCreation || '').getTime()
          ));
          this.filteredRatings.set(this.allRatings());
          this.loading.set(false);
        }
      });
    });
  }

  filterByRestaurant(restaurantId: string): void {
    if (!restaurantId) {
      this.filteredRatings.set(this.allRatings());
    } else {
      this.filteredRatings.set(this.allRatings().filter(r => r.restaurantId === restaurantId));
    }
  }

  getRestaurantName(id: string): string {
    return this.restaurants().find(r => r.id === id)?.name || id;
  }

  deleteRating(rating: Rating): void {
    if (!confirm('Supprimer cet avis ?')) return;
    this.ratingService.deleteRating(rating.id!, undefined, true).subscribe(() => {
      this.allRatings.update(list => list.filter(r => r.id !== rating.id));
      this.filteredRatings.update(list => list.filter(r => r.id !== rating.id));
    });
  }
}
