import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryService } from '../../../services/delivery.service';
import { Delivery, DeliveryStatus } from '../../../models/delivery.model';
import { mockDelivery } from '../../../data/mock.data';

@Component({
  selector: 'app-admin-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">🛵 Gestion des Livraisons</h2>
          <p class="text-gray-500 text-sm mt-1">API: delivery-service → GET/PUT /api/delivery</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">RabbitMQ: order.created</span>
        </div>
      </div>

      <!-- Status Filter -->
      <div class="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 overflow-x-auto">
        <button *ngFor="let s of statuses"
                (click)="filterStatus = s.value; applyFilter()"
                [class]="'px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm ' + (filterStatus === s.value ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')">
          {{ s.icon }} {{ s.label }}
        </button>
      </div>

      <!-- Deliveries Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Commande</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Livreur</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Adresse</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Frais</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">ETA</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Statut</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let d of filtered()" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <p class="font-semibold text-gray-900 text-sm">#{{ d.orderId }}</p>
                <p class="text-xs text-gray-500">{{ d.createdAt | date:'dd/MM HH:mm' }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-900">{{ d.driverName || '—' }}</p>
                <p class="text-xs text-gray-500">{{ d.driverPhone || 'Non assigné' }}</p>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{{ d.deliveryAddress }}</td>
              <td class="px-6 py-4 font-semibold text-gray-900">{{ d.deliveryFee | number:'1.2-2' }}€</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ d.estimatedMinutes }} min</td>
              <td class="px-6 py-4">
                <span [class]="'px-2 py-1 rounded-full text-xs font-semibold ' + statusClass(d.status)">
                  {{ statusLabel(d.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <select (change)="updateStatus(d.orderId, $any($event.target).value)"
                        class="text-xs px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500">
                  <option value="">Changer statut</option>
                  <option value="ASSIGNED">Assigné</option>
                  <option value="PICKED_UP">Récupéré</option>
                  <option value="ON_THE_WAY">En route</option>
                  <option value="DELIVERED">Livré</option>
                  <option value="CANCELLED">Annulé</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="filtered().length === 0" class="p-8 text-center text-gray-500">
          Aucune livraison trouvée
        </div>
      </div>
    </div>
  `
})
export class AdminDeliveriesComponent implements OnInit {
  deliveries = signal<any[]>([]);
  filtered = signal<any[]>([]);
  filterStatus = '';

  statuses = [
    { value: '', label: 'Toutes', icon: '📋' },
    { value: 'PENDING', label: 'En attente', icon: '⏳' },
    { value: 'ASSIGNED', label: 'Assignées', icon: '👤' },
    { value: 'ON_THE_WAY', label: 'En route', icon: '🛵' },
    { value: 'DELIVERED', label: 'Livrées', icon: '✅' },
    { value: 'CANCELLED', label: 'Annulées', icon: '❌' },
  ];

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit(): void {
    // Mock data since we don't have a list endpoint
    const mockList = [
      { orderId: 'order-1', driverName: 'Thomas Dubois', driverPhone: '+33 6 98 76 54 32',
        deliveryAddress: '15 Rue de la Paix, 75002 Paris', deliveryFee: 2.50,
        estimatedMinutes: 30, status: 'DELIVERED', createdAt: new Date().toISOString() },
      { orderId: 'order-2', driverName: 'Marie Leroy', driverPhone: '+33 6 12 34 56 78',
        deliveryAddress: '42 Avenue des Champs, 75008 Paris', deliveryFee: 3.00,
        estimatedMinutes: 15, status: 'ON_THE_WAY', createdAt: new Date().toISOString() },
      { orderId: 'order-3', driverName: null, driverPhone: null,
        deliveryAddress: '8 Rue du Commerce, 75015 Paris', deliveryFee: 1.99,
        estimatedMinutes: 35, status: 'PENDING', createdAt: new Date().toISOString() },
    ];
    this.deliveries.set(mockList);
    this.filtered.set(mockList);
  }

  applyFilter(): void {
    if (!this.filterStatus) { this.filtered.set(this.deliveries()); return; }
    this.filtered.set(this.deliveries().filter(d => d.status === this.filterStatus));
  }

  updateStatus(orderId: string, status: string): void {
    if (!status) return;
    this.deliveryService.updateStatus(orderId, status as DeliveryStatus).subscribe(() => {
      this.deliveries.update(list => list.map(d => d.orderId === orderId ? { ...d, status } : d));
      this.applyFilter();
    });
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
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
      PENDING: '⏳ En attente', ASSIGNED: '👤 Assigné', PICKED_UP: '📦 Récupéré',
      ON_THE_WAY: '🛵 En route', DELIVERED: '✅ Livré', CANCELLED: '❌ Annulé',
    };
    return map[status] || status;
  }
}
