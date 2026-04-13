import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../../services/restaurant.service';
import { AuthService } from '../../../services/auth.service';
import { Restaurant } from '../../../models/restaurant.model';

@Component({
  selector: 'app-admin-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">🏪 Gestion des Restaurants</h2>
          <p class="text-gray-500 text-sm mt-1">API: restaurant-service → POST/PUT/DELETE /api/restaurants/manage</p>
        </div>
        <button (click)="openModal()"
                class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-2">
          + Ajouter un restaurant
        </button>
      </div>

      <!-- Search -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <input type="text" [(ngModel)]="search" placeholder="Rechercher un restaurant..."
               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Restaurant</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Cuisine</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Note</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Livraison</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Statut</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let r of filtered()" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img [src]="r.image" [alt]="r.name" class="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <p class="font-semibold text-gray-900">{{ r.name }}</p>
                    <p class="text-xs text-gray-500">{{ r.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-700">{{ r.cuisine }}</td>
              <td class="px-6 py-4">
                <span class="flex items-center gap-1">⭐ {{ r.rating }} ({{ r.ratingCount }})</span>
              </td>
              <td class="px-6 py-4 text-gray-700">{{ r.deliveryTime }} min • {{ r.deliveryFee | number:'1.2-2' }}€</td>
              <td class="px-6 py-4">
                <span [class]="'px-2 py-1 rounded-full text-xs font-semibold ' + (r.active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')">
                  {{ r.active !== false ? 'Actif' : 'Inactif' }}
                </span>
                <span *ngIf="r.promoted" class="ml-1 px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">Promu</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button (click)="editRestaurant(r)"
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">✏️</button>
                  <button (click)="deleteRestaurant(r.id)"
                          class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="loading()" class="p-8 text-center text-gray-500">Chargement...</div>
      </div>
    </div>

    <!-- Modal -->
    <div *ngIf="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900">{{ editing ? 'Modifier' : 'Ajouter' }} un restaurant</h3>
          <p class="text-sm text-gray-500 mt-1">API: {{ editing ? 'PUT' : 'POST' }} /api/restaurants/manage</p>
        </div>
        <form (ngSubmit)="saveRestaurant()" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Nom *</label>
              <input type="text" [(ngModel)]="form.name" name="name" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Cuisine *</label>
              <input type="text" [(ngModel)]="form.cuisine" name="cuisine" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea [(ngModel)]="form.description" name="description" rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Frais livraison (€)</label>
              <input type="number" [(ngModel)]="form.deliveryFee" name="deliveryFee" step="0.01"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Commande min (€)</label>
              <input type="number" [(ngModel)]="form.minOrder" name="minOrder"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Temps de livraison</label>
            <input type="text" [(ngModel)]="form.deliveryTime" name="deliveryTime" placeholder="25-35"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">URL Image</label>
            <input type="url" [(ngModel)]="form.image" name="image"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" [(ngModel)]="form.promoted" name="promoted" class="w-4 h-4 text-orange-500" />
              <span class="text-sm font-medium text-gray-700">Promu</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" [(ngModel)]="form.active" name="active" class="w-4 h-4 text-orange-500" />
              <span class="text-sm font-medium text-gray-700">Actif</span>
            </label>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" (click)="showModal = false"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button type="submit"
                    class="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
              {{ editing ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminRestaurantsComponent implements OnInit {
  loading = signal(true);
  restaurants = signal<Restaurant[]>([]);
  search = '';
  showModal = false;
  editing: Restaurant | null = null;
  form: Partial<Restaurant> = this.emptyForm();

  filtered = () => this.restaurants().filter(r =>
    !this.search || r.name.toLowerCase().includes(this.search.toLowerCase())
  );

  constructor(private restaurantService: RestaurantService, private auth: AuthService) {}

  ngOnInit(): void {
    this.restaurantService.getAll().subscribe(d => { this.restaurants.set(d); this.loading.set(false); });
  }

  openModal(): void { this.editing = null; this.form = this.emptyForm(); this.showModal = true; }

  editRestaurant(r: Restaurant): void { this.editing = r; this.form = { ...r }; this.showModal = true; }

  saveRestaurant(): void {
    // Mapper deliveryTime → deliveryTimeRange pour l'API Spring
    const payload = { ...this.form, deliveryTimeRange: this.form.deliveryTime || this.form.deliveryTimeRange };
    if (this.editing) {
      this.restaurantService.update(this.editing.id, payload).subscribe(updated => {
        this.restaurants.update(list => list.map(r => r.id === updated.id ? updated : r));
        this.showModal = false;
      });
    } else {
      this.restaurantService.create(payload).subscribe(created => {
        this.restaurants.update(list => [...list, created]);
        this.showModal = false;
      });
    }
  }

  deleteRestaurant(id: string): void {
    if (!confirm('Supprimer ce restaurant ?')) return;
    this.restaurantService.delete(id).subscribe(() => {
      this.restaurants.update(list => list.filter(r => r.id !== id));
    });
  }

  private emptyForm(): Partial<Restaurant> {
    return { name: '', cuisine: '', description: '', deliveryFee: 2.5, minOrder: 15,
             deliveryTime: '25-35', deliveryTimeRange: '25-35', image: '', promoted: false, active: true, categories: [],
             ownerId: this.auth.currentUser()?.userId || 'admin-001' };
  }
}
