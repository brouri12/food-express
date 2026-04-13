import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../../services/menu.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { MenuItem } from '../../../models/menu.model';
import { Restaurant } from '../../../models/restaurant.model';

@Component({
  selector: 'app-admin-menus',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">🍽️ Gestion des Menus</h2>
          <p class="text-gray-500 text-sm mt-1">API: menu-service → POST/PUT/DELETE /api/menus/manage</p>
        </div>
        <button (click)="openModal()"
                class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
          + Ajouter un plat
        </button>
      </div>

      <!-- Restaurant Filter -->
      <div class="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
        <label class="text-sm font-semibold text-gray-700">Filtrer par restaurant :</label>
        <select [(ngModel)]="selectedRestaurantId" (ngModelChange)="loadMenus()"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option value="">Tous les restaurants</option>
          <option *ngFor="let r of restaurants()" [value]="r.id">{{ r.name }}</option>
        </select>
      </div>

      <!-- Menu Items Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Plat</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Catégorie</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Prix</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Tags</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Statut</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let item of allItems()" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img [src]="item.image || item.imageUrl" [alt]="item.name" class="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <p class="font-semibold text-gray-900">{{ item.name }}</p>
                    <p class="text-xs text-gray-500 line-clamp-1">{{ item.description }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-700">{{ item.category }}</td>
              <td class="px-6 py-4 font-bold text-orange-600">{{ item.price | number:'1.2-2' }}€</td>
              <td class="px-6 py-4">
                <span *ngIf="item.popular" class="mr-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">⭐ Populaire</span>
                <span *ngIf="item.vegetarian" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">🌿 Végé</span>
              </td>
              <td class="px-6 py-4">
                <span [class]="'px-2 py-1 rounded-full text-xs font-semibold ' + (item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')">
                  {{ item.available ? 'Disponible' : 'Indisponible' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button (click)="editItem(item)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">✏️</button>
                  <button (click)="deleteItem(item.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="allItems().length === 0" class="p-8 text-center text-gray-500">
          Sélectionnez un restaurant pour voir ses plats
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div *ngIf="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900">{{ editing ? 'Modifier' : 'Ajouter' }} un plat</h3>
        </div>
        <form (ngSubmit)="saveItem()" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Restaurant *</label>
            <select [(ngModel)]="form.restaurantId" name="restaurantId" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option *ngFor="let r of restaurants()" [value]="r.id">{{ r.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nom du plat *</label>
            <input type="text" [(ngModel)]="form.name" name="name" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea [(ngModel)]="form.description" name="description" rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Prix (€) *</label>
              <input type="number" [(ngModel)]="form.price" name="price" step="0.01" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Catégorie *</label>
              <input type="text" [(ngModel)]="form.category" name="category" placeholder="Entrées, Plats..."
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">URL Image</label>
            <input type="url" [(ngModel)]="form.imageUrl" name="imageUrl"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" [(ngModel)]="form.popular" name="popular" class="w-4 h-4 text-orange-500" />
              <span class="text-sm font-medium text-gray-700">⭐ Populaire</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" [(ngModel)]="form.vegetarian" name="vegetarian" class="w-4 h-4 text-green-500" />
              <span class="text-sm font-medium text-gray-700">🌿 Végétarien</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" [(ngModel)]="form.available" name="available" class="w-4 h-4 text-blue-500" />
              <span class="text-sm font-medium text-gray-700">Disponible</span>
            </label>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" (click)="showModal = false"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
            <button type="submit"
                    class="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
              {{ editing ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminMenusComponent implements OnInit {
  restaurants = signal<Restaurant[]>([]);
  allItems = signal<MenuItem[]>([]);
  selectedRestaurantId = '';
  showModal = false;
  editing: MenuItem | null = null;
  form: any = this.emptyForm();

  constructor(private menuService: MenuService, private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.restaurantService.getAll().subscribe(d => this.restaurants.set(d));
  }

  loadMenus(): void {
    if (!this.selectedRestaurantId) { this.allItems.set([]); return; }
    this.menuService.getByRestaurant(this.selectedRestaurantId).subscribe(data => {
      const items = Object.values(data).flat();
      this.allItems.set(items);
    });
  }

  openModal(): void { this.editing = null; this.form = this.emptyForm(); this.showModal = true; }
  editItem(item: MenuItem): void { this.editing = item; this.form = { ...item }; this.showModal = true; }

  saveItem(): void {
    if (this.editing) {
      this.menuService.update(this.editing.id, this.form).subscribe(updated => {
        this.allItems.update(list => list.map(i => i.id === updated.id ? updated : i));
        this.showModal = false;
      });
    } else {
      this.menuService.create(this.form).subscribe(created => {
        this.allItems.update(list => [...list, created]);
        this.showModal = false;
      });
    }
  }

  deleteItem(id: string): void {
    if (!confirm('Supprimer ce plat ?')) return;
    this.menuService.delete(id).subscribe(() => {
      this.allItems.update(list => list.filter(i => i.id !== id));
    });
  }

  private emptyForm() {
    return { restaurantId: '', name: '', description: '', price: 0, category: '',
             imageUrl: '', popular: false, vegetarian: false, available: true };
  }
}
