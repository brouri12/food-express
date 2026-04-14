import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromotionService } from '../../../services/promotion.service';
import { Promotion } from '../../../models/promotion.model';
import { SafeImgPipe } from '../../../shared/safe-img.pipe';

@Component({
  selector: 'app-admin-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeImgPipe],
  template: `
    <div class="space-y-6 fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">🏷️ Gestion des Promotions</h2>
          <p class="text-gray-500 text-sm mt-1">API: promotion-service → POST /api/promotions</p>
        </div>
        <button (click)="openModal()"
                class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
          + Créer une promotion
        </button>
      </div>

      <!-- Promo Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let p of promotions()"
             class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:border-orange-300 transition-colors">
          <div class="relative h-32">
            <img [src]="(p.imageUrl || p.image) | safeImg:'promo'" [alt]="p.title" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-2 left-3">
              <span *ngIf="p.code" class="bg-white text-gray-900 px-2 py-1 rounded text-xs font-bold font-mono">
                {{ p.code }}
              </span>
            </div>
            <!-- Flash badge -->
            <div *ngIf="p.flashEndTime" class="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
              ⚡ FLASH
            </div>
            <!-- Referral badge -->
            <div *ngIf="p.referralPromo" class="absolute top-2 left-2 bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
              🎁 Parrainage
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-2 left-3">
              <span *ngIf="p.code" class="bg-white text-gray-900 px-2 py-1 rounded text-xs font-bold font-mono">
                {{ p.code }}
              </span>
            </div>
            <div class="absolute top-2 right-2">
              <span [class]="'px-2 py-1 rounded-full text-xs font-semibold ' + (p.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white')">
                {{ p.active ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-gray-900 mb-1">{{ p.title }}</h3>
            <p class="text-sm text-gray-600 mb-3">{{ p.description }}</p>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>Expire : {{ p.validUntil }}</span>
              <span class="bg-orange-100 text-orange-700 px-2 py-1 rounded font-semibold">{{ p.type }}</span>
            </div>
            <div class="flex gap-2 mt-3">
              <button (click)="editPromo(p)"
                      class="flex-1 py-1.5 border border-blue-300 text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                ✏️ Modifier
              </button>
              <button (click)="deletePromo(p.id)"
                      class="flex-1 py-1.5 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors">
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div *ngIf="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900">{{ editing ? 'Modifier' : 'Créer' }} une promotion</h3>
          <p class="text-sm text-gray-500 mt-1">API: POST /api/promotions</p>
        </div>
        <form (ngSubmit)="savePromo()" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Titre *</label>
            <input type="text" [(ngModel)]="form.title" name="title" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea [(ngModel)]="form.description" name="description" rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Code promo</label>
              <input type="text" [(ngModel)]="form.code" name="code" placeholder="BIENVENUE20"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono uppercase" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Type</label>
              <select [(ngModel)]="form.type" name="type"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="PERCENTAGE">Pourcentage</option>
                <option value="FIXED_AMOUNT">Montant fixe</option>
                <option value="FREE_DELIVERY">Livraison gratuite</option>
                <option value="BUY_ONE_GET_ONE">1 acheté = 1 offert</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Réduction (%)</label>
              <input type="number" [(ngModel)]="form.discountPercent" name="discountPercent" min="0" max="100"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Commande min (€)</label>
              <input type="number" [(ngModel)]="form.minOrderAmount" name="minOrderAmount" step="0.01"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Date début</label>
              <input type="date" [(ngModel)]="form.validFrom" name="validFrom"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Date fin</label>
              <input type="date" [(ngModel)]="form.validUntil" name="validUntil"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">URL Image</label>
            <input type="url" [(ngModel)]="form.imageUrl" name="imageUrl"
                   placeholder="https://images.unsplash.com/..."
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <!-- Live preview -->
            <div *ngIf="form.imageUrl" class="mt-2 h-24 rounded-lg overflow-hidden border border-gray-200">
              <img [src]="form.imageUrl | safeImg:'promo'" class="w-full h-full object-cover" alt="preview" />
            </div>
          </div>
          <!-- Flash promo -->
          <div class="bg-red-50 border border-red-200 rounded-lg p-3">
            <label class="block text-sm font-semibold text-red-800 mb-1">⚡ Promo Flash (optionnel)</label>
            <input type="datetime-local" [(ngModel)]="form.flashEndTime" name="flashEndTime"
                   class="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm" />
            <p class="text-xs text-red-600 mt-1">Laissez vide pour une promo normale</p>
          </div>
          <!-- Max usage per user -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Max utilisations par client</label>
            <input type="number" [(ngModel)]="form.maxUsagePerUser" name="maxUsagePerUser" min="1"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" (click)="showModal = false"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
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
export class AdminPromotionsComponent implements OnInit {
  promotions = signal<Promotion[]>([]);
  showModal = false;
  editing: Promotion | null = null;
  form: any = this.emptyForm();

  constructor(private promotionService: PromotionService) {}

  ngOnInit(): void {
    this.promotionService.getAll().subscribe(d => this.promotions.set(d));
  }

  openModal(): void { this.editing = null; this.form = this.emptyForm(); this.showModal = true; }
  editPromo(p: Promotion): void { this.editing = p; this.form = { ...p }; this.showModal = true; }

  savePromo(): void {
    if (this.editing) {
      this.promotionService.update(this.editing.id, this.form).subscribe(updated => {
        this.promotions.update(list => list.map(p => p.id === updated.id ? updated : p));
        this.showModal = false;
      });
    } else {
      this.promotionService.create(this.form).subscribe(created => {
        this.promotions.update(list => [...list, created]);
        this.showModal = false;
      });
    }
  }

  deletePromo(id: string): void {
    if (!confirm('Supprimer cette promotion ?')) return;
    this.promotionService.delete(id).subscribe(() => {
      this.promotions.update(list => list.filter(p => p.id !== id));
    });
  }

  private emptyForm() {
    return { title: '', description: '', code: '', type: 'PERCENTAGE', discountPercent: 0,
             minOrderAmount: 0, validFrom: '', validUntil: '', imageUrl: '', active: true,
             flashEndTime: null, maxUsagePerUser: 1, targetSegment: 'ALL' };
  }
}
