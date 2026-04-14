import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order, ORDER_STATUS_LABELS } from '../../models/order.model';
import { API_BASE } from '../../services/api.config';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">📦 Mes Commandes</h1>
            <p class="text-gray-500 text-sm mt-1">API: order-service → GET /api/orders/user/:userId</p>
          </div>
          <a routerLink="/restaurants"
             class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
            + Commander
          </a>
        </div>

        <!-- Loading -->
        <div *ngIf="loading()" class="flex justify-center py-12">
          <div class="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Empty -->
        <div *ngIf="!loading() && orders().length === 0" class="text-center py-16 bg-white rounded-xl shadow-sm">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Aucune commande</h3>
          <p class="text-gray-500 mb-6">Vous n'avez pas encore passé de commande.</p>
          <a routerLink="/restaurants"
             class="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold">
            Découvrir les restaurants
          </a>
        </div>

        <!-- Orders list -->
        <div *ngIf="!loading()" class="space-y-4">
          <div *ngFor="let order of orders()"
               class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <div class="flex items-center gap-3 mb-1">
                    <h3 class="font-bold text-gray-900 text-lg">{{ order.restaurantName }}</h3>
                    <span [class]="statusClass(order.status)"
                          class="px-3 py-1 rounded-full text-xs font-semibold">
                      {{ statusLabel(order.status) }}
                    </span>
                  </div>
                  <p class="text-gray-500 text-sm">Commande #{{ order.id }} • {{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
                  <p class="text-gray-500 text-sm">📍 {{ order.deliveryAddress }}</p>
                  <!-- Commande planifiée -->
                  <p *ngIf="order.scheduledFor" class="text-purple-600 text-sm font-medium mt-1">
                    ⏰ Planifiée pour {{ order.scheduledFor | date:'dd/MM HH:mm' }}
                  </p>
                  <!-- Remboursement -->
                  <p *ngIf="order.refundStatus" [class]="'text-xs font-semibold mt-1 ' + refundClass(order.refundStatus)">
                    💰 Remboursement : {{ refundLabel(order.refundStatus) }}
                    <span *ngIf="order.refundAmount"> — {{ order.refundAmount | number:'1.2-2' }}€</span>
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-orange-600">{{ order.totalAmount | number:'1.2-2' }}€</p>
                  <p *ngIf="order.discount && order.discount > 0" class="text-green-600 text-sm">
                    -{{ order.discount | number:'1.2-2' }}€ remise
                  </p>
                </div>
              </div>

              <!-- Items -->
              <div class="border-t border-gray-100 pt-4 mb-4">
                <div *ngFor="let item of order.items" class="flex justify-between text-sm py-1">
                  <span class="text-gray-700">{{ item.quantity }}x {{ item.menuItemName }}</span>
                  <span class="font-semibold text-gray-900">{{ item.subtotal | number:'1.2-2' }}€</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-3">
                <!-- Suivi livraison pour commandes actives -->
                <a *ngIf="isActive(order.status)"
                   [routerLink]="['/delivery', order.id]"
                   class="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg font-semibold text-sm text-center hover:from-orange-600 hover:to-red-600 transition-all">
                  🛵 Suivre la livraison
                </a>

                <!-- QR Code toggle -->
                <button (click)="toggleQR(order.id!)"
                        class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  {{ showQR() === order.id ? 'Masquer QR' : '📱 QR Code' }}
                </button>

                <!-- Demande de remboursement -->
                <button *ngIf="canRefund(order)"
                        (click)="requestRefund(order)"
                        class="px-4 py-2 border border-orange-300 text-orange-600 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-colors">
                  💰 Remboursement
                </button>
              </div>

              <!-- QR Code image -->
              <div *ngIf="showQR() === order.id" class="mt-4 flex justify-center">
                <div class="bg-white p-4 rounded-xl border-2 border-orange-200 shadow-sm">
                  <img [src]="qrCodeUrl(order.id!)"
                       [alt]="'QR Code commande #' + order.id"
                       class="w-48 h-48 object-contain"
                       (error)="onQRError($event)" />
                  <p class="text-center text-xs text-gray-500 mt-2">Commande #{{ order.id }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);
  showQR = signal<number | null>(null);

  constructor(
    private orderService: OrderService,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const userId = this.auth.currentUser()?.userId || 'user-client-001';
    this.orderService.getOrdersByUser(userId).subscribe(data => {
      this.orders.set(data);
      this.loading.set(false);
    });
  }

  toggleQR(id: number): void {
    this.showQR.set(this.showQR() === id ? null : id);
  }

  qrCodeUrl(id: number): string {
    return this.orderService.getQRCodeUrl(id);
  }

  onQRError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  canRefund(order: any): boolean {
    return (order.status === 'CANCELLED' || order.status === 'DELIVERED') && !order.refundStatus;
  }

  requestRefund(order: any): void {
    const reason = prompt('Raison du remboursement :');
    if (!reason) return;
    this.http.post<any>(`${API_BASE}/api/orders/${order.id}/refund`, { reason }).subscribe({
      next: updated => {
        this.orders.update(list => list.map(o => o.id === updated.id ? { ...o, ...updated } : o));
        alert('✅ Demande de remboursement envoyée');
      },
      error: err => alert('Erreur : ' + (err.error?.message || err.message))
    });
  }

  refundClass(status: string): string {
    return { REQUESTED: 'text-yellow-600', APPROVED: 'text-green-600', REJECTED: 'text-red-600' }[status] || 'text-gray-500';
  }

  refundLabel(status: string): string {
    return { REQUESTED: '⏳ En attente', APPROVED: '✅ Approuvé', REJECTED: '❌ Refusé' }[status] || status;
  }

  statusLabel(status: string): string {
    return ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status;
  }

  isActive(status: string): boolean {
    return ['CONFIRMED', 'PREPARING', 'READY', 'ON_THE_WAY'].includes(status);
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING:    'bg-yellow-100 text-yellow-700',
      CONFIRMED:  'bg-blue-100 text-blue-700',
      PREPARING:  'bg-purple-100 text-purple-700',
      READY:      'bg-indigo-100 text-indigo-700',
      ON_THE_WAY: 'bg-orange-100 text-orange-700',
      DELIVERED:  'bg-green-100 text-green-700',
      CANCELLED:  'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  }
}
