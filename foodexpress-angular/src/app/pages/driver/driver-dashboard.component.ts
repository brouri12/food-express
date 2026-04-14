import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DeliveryService } from '../../services/delivery.service';
import { AuthService } from '../../services/auth.service';
import { DeliveryStatus } from '../../models/delivery.model';
import { API_BASE } from '../../services/api.config';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8 space-y-8 fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">🛵 Tableau de bord Livreur</h1>
          <p class="text-gray-500 text-sm mt-1">Bonjour {{ driverName }} — prenez une livraison en attente</p>
        </div>
        <button (click)="loadAll()" class="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium">
          🔄 Actualiser
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 border-b border-gray-200">
        <button (click)="tab = 'pending'"
                [class]="'px-5 py-3 font-semibold text-sm border-b-2 transition-colors ' + (tab === 'pending' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700')">
          ⏳ En attente
          <span *ngIf="pending().length > 0" class="ml-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{{ pending().length }}</span>
        </button>
        <button (click)="tab = 'mine'"
                [class]="'px-5 py-3 font-semibold text-sm border-b-2 transition-colors ' + (tab === 'mine' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700')">
          📦 Mes livraisons
          <span *ngIf="mine().length > 0" class="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{{ mine().length }}</span>
        </button>
        <button (click)="tab = 'earnings'; loadEarnings()"
                [class]="'px-5 py-3 font-semibold text-sm border-b-2 transition-colors ' + (tab === 'earnings' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700')">
          💰 Revenus
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading()" class="text-center py-12 text-gray-500">
        <div class="text-4xl mb-3 animate-bounce">🛵</div>
        Chargement...
      </div>

      <!-- PENDING TAB -->
      <div *ngIf="!loading() && tab === 'pending'" class="space-y-4">
        <div *ngIf="pending().length === 0" class="text-center py-12 text-gray-400">
          <p class="text-4xl mb-3">✅</p>
          <p class="font-medium">Aucune livraison en attente</p>
        </div>

        <div *ngFor="let d of pending()"
             class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-3">
                <span class="font-bold text-gray-900">#{{ d.orderId | slice:0:8 }}...</span>
                <span class="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">⏳ En attente</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <span>📍</span>
                <span>{{ d.deliveryAddress }}</span>
              </div>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span>💰 <strong class="text-gray-800">{{ d.deliveryFee | number:'1.2-2' }}€</strong></span>
                <span>⏱️ <strong class="text-gray-800">{{ d.estimatedMinutes }} min</strong></span>
                <span>🕐 {{ d.createdAt | date:'HH:mm' }}</span>
              </div>
            </div>
            <button (click)="takeDelivery(d)"
                    [disabled]="taking() === d.orderId"
                    class="flex-shrink-0 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
              {{ taking() === d.orderId ? '⏳...' : '✋ Prendre' }}
            </button>
          </div>
        </div>
      </div>

      <!-- MY DELIVERIES TAB -->
      <div *ngIf="!loading() && tab === 'mine'" class="space-y-4">
        <div *ngIf="mine().length === 0" class="text-center py-12 text-gray-400">
          <p class="text-4xl mb-3">📭</p>
          <p class="font-medium">Vous n'avez pas encore de livraisons</p>
        </div>

        <div *ngFor="let d of mine()"
             class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-3">
                <span class="font-bold text-gray-900">#{{ d.orderId | slice:0:8 }}...</span>
                <span [class]="'px-2 py-0.5 text-xs font-semibold rounded-full ' + statusClass(d.status)">
                  {{ statusLabel(d.status) }}
                </span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <span>📍</span><span>{{ d.deliveryAddress }}</span>
              </div>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span>💰 <strong class="text-gray-800">{{ d.deliveryFee | number:'1.2-2' }}€</strong></span>
                <span>⏱️ <strong class="text-gray-800">{{ d.estimatedMinutes }} min</strong></span>
              </div>
              <!-- Rating reçu -->
              <div *ngIf="d.driverRating" class="flex items-center gap-1 text-sm">
                <span *ngFor="let s of [1,2,3,4,5]; let i=index"
                      [class]="i < d.driverRating ? 'text-yellow-400' : 'text-gray-300'">★</span>
                <span class="text-gray-500 text-xs ml-1">{{ d.driverRatingComment }}</span>
              </div>
            </div>
            <!-- Status progression -->
            <div *ngIf="d.status !== 'DELIVERED' && d.status !== 'CANCELLED'" class="flex-shrink-0">
              <select (change)="updateStatus(d.orderId, $any($event.target).value)"
                      class="text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">Mettre à jour</option>
                <option *ngIf="d.status === 'ASSIGNED'" value="PICKED_UP">📦 Récupéré</option>
                <option *ngIf="d.status === 'PICKED_UP'" value="ON_THE_WAY">🛵 En route</option>
                <option *ngIf="d.status === 'ON_THE_WAY'" value="DELIVERED">✅ Livré</option>
              </select>
            </div>
            <div *ngIf="d.status === 'DELIVERED'" class="flex-shrink-0 text-green-600 font-semibold text-sm">
              ✅ Terminé
            </div>
          </div>
        </div>
      </div>

      <!-- EARNINGS TAB -->
      <div *ngIf="tab === 'earnings'" class="space-y-6">
        <div *ngIf="!earnings()" class="text-center py-8 text-gray-400">Chargement...</div>
        <ng-container *ngIf="earnings()">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-xl shadow-sm p-5 text-center">
              <p class="text-3xl font-bold text-green-600">{{ earnings().totalEarnings }}€</p>
              <p class="text-sm text-gray-500 mt-1">Revenus totaux</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-5 text-center">
              <p class="text-3xl font-bold text-blue-600">{{ earnings().weekEarnings }}€</p>
              <p class="text-sm text-gray-500 mt-1">Cette semaine</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-5 text-center">
              <p class="text-3xl font-bold text-orange-600">{{ earnings().totalDeliveries }}</p>
              <p class="text-sm text-gray-500 mt-1">Livraisons</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-5 text-center">
              <p class="text-3xl font-bold text-purple-600">{{ earnings().averagePerDelivery }}€</p>
              <p class="text-sm text-gray-500 mt-1">Moyenne/livraison</p>
            </div>
          </div>
          <!-- Ratings -->
          <div *ngIf="ratings()" class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-bold text-gray-900 mb-4">⭐ Mes notes clients</h3>
            <div class="flex items-center gap-4 mb-4">
              <div class="text-4xl font-bold text-yellow-500">{{ ratings().average }}</div>
              <div>
                <div class="flex gap-0.5">
                  <span *ngFor="let s of [1,2,3,4,5]; let i=index"
                        [class]="i < ratings().average ? 'text-yellow-400 text-2xl' : 'text-gray-300 text-2xl'">★</span>
                </div>
                <p class="text-sm text-gray-500">{{ ratings().count }} avis</p>
              </div>
            </div>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div *ngFor="let r of ratings().ratings"
                   class="border border-gray-100 rounded-lg p-3 text-sm">
                <div class="flex items-center gap-2 mb-1">
                  <span *ngFor="let s of [1,2,3,4,5]; let i=index"
                        [class]="i < r.rating ? 'text-yellow-400' : 'text-gray-300'">★</span>
                  <span class="text-xs text-gray-400">{{ r.date | slice:0:10 }}</span>
                </div>
                <p *ngIf="r.comment" class="text-gray-600">{{ r.comment }}</p>
              </div>
            </div>
          </div>
        </ng-container>
      </div>

    </div>
  `
})
export class DriverDashboardComponent implements OnInit {
  tab = 'pending';
  pending = signal<any[]>([]);
  mine = signal<any[]>([]);
  loading = signal(true);
  taking = signal('');
  earnings = signal<any>(null);
  ratings = signal<any>(null);

  get driverName(): string {
    return this.auth.currentUser()?.firstName || 'Livreur';
  }

  get driverId(): string {
    return this.auth.currentUser()?.userId || '';
  }

  constructor(private deliveryService: DeliveryService, public auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading.set(true);
    this.deliveryService.getPending().subscribe(data => {
      this.pending.set(data);
      this.deliveryService.getMyDeliveries(this.driverId).subscribe(mine => {
        this.mine.set(mine);
        this.loading.set(false);
      });
    });
  }

  takeDelivery(d: any): void {
    const user = this.auth.currentUser();
    if (!user) return;
    this.taking.set(d.orderId);
    const fullName = `${user.firstName} ${user.lastName || ''}`.trim();
    this.deliveryService.assignSelf(d.orderId, user.userId, fullName, '').subscribe({
      next: () => {
        this.taking.set('');
        this.tab = 'mine';
        this.loadAll();
      },
      error: () => this.taking.set('')
    });
  }

  loadEarnings(): void {
    if (this.earnings()) return;
    const id = this.driverId;
    this.http.get<any>(`${API_BASE}/api/delivery/driver/${id}/earnings`).subscribe({
      next: data => this.earnings.set(data),
      error: () => this.earnings.set({ totalEarnings: 0, weekEarnings: 0, totalDeliveries: 0, averagePerDelivery: 0 })
    });
    this.http.get<any>(`${API_BASE}/api/delivery/driver/${id}/ratings`).subscribe({
      next: data => this.ratings.set(data),
      error: () => this.ratings.set({ average: 0, count: 0, ratings: [] })
    });
  }

  updateStatus(orderId: string, status: string): void {
    if (!status) return;
    this.deliveryService.updateStatus(orderId, status as DeliveryStatus).subscribe(() => {
      this.loadAll();
    });
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      ASSIGNED: 'bg-blue-100 text-blue-700',
      PICKED_UP: 'bg-purple-100 text-purple-700',
      ON_THE_WAY: 'bg-orange-100 text-orange-700',
      DELIVERED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      ASSIGNED: '👤 Assigné', PICKED_UP: '📦 Récupéré',
      ON_THE_WAY: '🛵 En route', DELIVERED: '✅ Livré', CANCELLED: '❌ Annulé',
    };
    return map[status] || status;
  }
}
