import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order, ORDER_STATUS_LABELS, OrderStatus } from '../../../models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">📦 Gestion des Commandes</h2>
          <p class="text-gray-500 text-sm mt-1">API: order-service → GET/PATCH/DELETE /api/orders</p>
        </div>
        <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {{ orders().length }} commandes
        </span>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div *ngFor="let s of statusStats()"
             class="bg-white rounded-xl shadow-sm p-4 border-l-4"
             [style.border-color]="s.color">
          <p class="text-2xl font-bold text-gray-900">{{ s.count }}</p>
          <p class="text-gray-500 text-xs mt-1">{{ s.label }}</p>
        </div>
      </div>

      <!-- Filter -->
      <div class="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
        <label class="text-sm font-semibold text-gray-700">Statut :</label>
        <select [(ngModel)]="filterStatus" (ngModelChange)="applyFilter()"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option value="">Toutes</option>
          <option *ngFor="let s of allStatuses" [value]="s.value">{{ s.label }}</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">#</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Client</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Restaurant</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Articles</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Total</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Statut</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let o of filtered()" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 font-mono text-sm text-gray-500">#{{ o.id }}</td>
              <td class="px-6 py-4">
                <p class="font-semibold text-gray-900 text-sm">{{ o.clientName }}</p>
                <p class="text-xs text-gray-400 truncate max-w-32">{{ o.deliveryAddress }}</p>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ o.restaurantName }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ (o.items?.length ?? 0) }} articles</td>
              <td class="px-6 py-4 font-bold text-orange-600">{{ o.totalAmount | number:'1.2-2' }}€</td>
              <td class="px-6 py-4">
                <select [ngModel]="o.status"
                        (ngModelChange)="changeStatus(o, $event)"
                        [class]="'text-xs px-2 py-1 rounded-full font-semibold border-0 cursor-pointer ' + statusClass(o.status)">
                  <option *ngFor="let s of allStatuses" [value]="s.value">{{ s.label }}</option>
                </select>
              </td>
              <td class="px-6 py-4 text-xs text-gray-500">{{ o.createdAt | date:'dd/MM HH:mm' }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button (click)="openEdit(o)"
                          class="p-2 text-orange-600 hover:bg-orange-50 rounded-lg" title="Modifier">✏️</button>
                  <a [href]="qrUrl(o.id!)" target="_blank"
                     class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="QR Code">📱</a>
                  <button (click)="deleteOrder(o)"
                          class="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="loading()" class="p-8 text-center text-gray-500">Chargement...</div>
        <div *ngIf="!loading() && filtered().length === 0" class="p-8 text-center text-gray-400">
          <div class="text-4xl mb-2">📦</div>
          <p>Aucune commande trouvée</p>
        </div>
      </div>
    </div>

    <!-- ── Modal Modifier commande ─────────────────────────── -->
    <div *ngIf="editingOrder" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900">✏️ Modifier la commande #{{ editingOrder.id }}</h3>
            <p class="text-sm text-gray-500 mt-1">API: PATCH /api/orders/{{ editingOrder.id }}/status</p>
          </div>
          <button (click)="closeEdit()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div class="p-6 space-y-5">
          <!-- Info commande (lecture seule) -->
          <div class="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Client</span>
              <span class="font-semibold">{{ editingOrder.clientName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Restaurant</span>
              <span class="font-semibold">{{ editingOrder.restaurantName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Total</span>
              <span class="font-bold text-orange-600">{{ editingOrder.totalAmount | number:'1.2-2' }}€</span>
            </div>
          </div>

          <!-- Statut -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Statut de la commande</label>
            <select [(ngModel)]="editForm.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option *ngFor="let s of allStatuses" [value]="s.value">{{ s.label }}</option>
            </select>
          </div>

          <!-- Adresse de livraison -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Adresse de livraison</label>
            <input type="text" [(ngModel)]="editForm.deliveryAddress"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                   placeholder="Adresse de livraison" />
          </div>

          <!-- Articles (lecture seule) -->
          <div *ngIf="editingOrder.items?.length">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Articles</label>
            <div class="bg-gray-50 rounded-lg p-3 space-y-1 max-h-32 overflow-y-auto">
              <div *ngFor="let item of editingOrder.items" class="flex justify-between text-sm">
                <span class="text-gray-700">{{ item.quantity }}× {{ item.menuItemName }}</span>
                <span class="font-semibold text-gray-900">{{ item.subtotal | number:'1.2-2' }}€</span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 flex gap-3">
          <button (click)="closeEdit()"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Annuler
          </button>
          <button (click)="saveEdit()" [disabled]="saving"
                  class="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            <span *ngIf="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ saving ? 'Enregistrement...' : '✅ Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  filtered = signal<Order[]>([]);
  loading = signal(true);
  filterStatus = '';

  // Edit modal state
  editingOrder: Order | null = null;
  editForm = { status: '', deliveryAddress: '' };
  saving = false;

  allStatuses = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label }));

  statusStats = () => [
    { label: 'En attente', count: this.orders().filter(o => o.status === 'PENDING').length, color: '#f59e0b' },
    { label: 'En cours', count: this.orders().filter(o => ['CONFIRMED','PREPARING','READY','ON_THE_WAY'].includes(o.status)).length, color: '#3b82f6' },
    { label: 'Livrées', count: this.orders().filter(o => o.status === 'DELIVERED').length, color: '#10b981' },
    { label: 'Annulées', count: this.orders().filter(o => o.status === 'CANCELLED').length, color: '#ef4444' },
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe(data => {
      this.orders.set(data.sort((a, b) =>
        new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      ));
      this.filtered.set(this.orders());
      this.loading.set(false);
    });
  }

  applyFilter(): void {
    this.filtered.set(
      this.filterStatus ? this.orders().filter(o => o.status === this.filterStatus) : this.orders()
    );
  }

  changeStatus(order: Order, status: string): void {
    this.orderService.updateStatus(order.id!, status).subscribe(updated => {
      this.orders.update(list => list.map(o => o.id === updated.id ? updated : o));
      this.applyFilter();
    });
  }

  deleteOrder(order: Order): void {
    if (!confirm(`Supprimer la commande #${order.id} ?`)) return;
    this.orderService.deleteOrder(order.id!).subscribe(() => {
      this.orders.update(list => list.filter(o => o.id !== order.id));
      this.applyFilter();
    });
  }

  openEdit(order: Order): void {
    this.editingOrder = order;
    this.editForm = {
      status: order.status,
      deliveryAddress: order.deliveryAddress,
    };
  }

  closeEdit(): void {
    this.editingOrder = null;
    this.saving = false;
  }

  saveEdit(): void {
    if (!this.editingOrder) return;
    this.saving = true;

    // Update status if changed
    const statusChanged = this.editForm.status !== this.editingOrder.status;
    const obs = statusChanged
      ? this.orderService.updateStatus(this.editingOrder.id!, this.editForm.status)
      : null;

    const apply = (updated: Order) => {
      this.orders.update(list => list.map(o => o.id === updated.id ? updated : o));
      this.applyFilter();
      this.saving = false;
      this.closeEdit();
    };

    if (obs) {
      obs.subscribe({ next: apply, error: () => { this.saving = false; } });
    } else {
      this.saving = false;
      this.closeEdit();
    }
  }

  qrUrl(id: number): string {
    return this.orderService.getQRCodeUrl(id);
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
