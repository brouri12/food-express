import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryService } from '../../services/delivery.service';
import { Delivery, DeliveryStatus } from '../../models/delivery.model';

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deliveries.component.html'
})
export class DeliveriesComponent implements OnInit {
  deliveries: Delivery[] = [];
  filtered: Delivery[] = [];
  loading = true;
  filterStatus = '';
  searchQuery = '';

  statuses: DeliveryStatus[] = ['PENDING','CONFIRMED','PREPARING','PICKED_UP','ON_THE_WAY','DELIVERED','CANCELLED'];

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.deliveryService.getAll().subscribe({
      next: (data) => { this.deliveries = data; this.applyFilter(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyFilter() {
    this.filtered = this.deliveries.filter(d => {
      const matchStatus = !this.filterStatus || d.status === this.filterStatus;
      const matchSearch = !this.searchQuery ||
        d.orderId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        d.deliveryAddress.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }

  updateStatus(delivery: Delivery, status: DeliveryStatus) {
    this.deliveryService.updateStatus(delivery.id, status).subscribe(() => this.load());
  }

  delete(id: number) {
    if (confirm('Supprimer cette livraison ?')) {
      this.deliveryService.delete(id).subscribe(() => this.load());
    }
  }

  statusBadge(status: DeliveryStatus): string {
    const map: Record<string, string> = {
      PENDING: 'badge-gray', CONFIRMED: 'badge-blue', PREPARING: 'badge-orange',
      PICKED_UP: 'badge-orange', ON_THE_WAY: 'badge-orange', DELIVERED: 'badge-green', CANCELLED: 'badge-red'
    };
    return map[status] ?? 'badge-gray';
  }

  statusLabel(status: DeliveryStatus): string {
    const map: Record<string, string> = {
      PENDING: 'En attente', CONFIRMED: 'Confirmée', PREPARING: 'Préparation',
      PICKED_UP: 'Récupérée', ON_THE_WAY: 'En route', DELIVERED: 'Livrée', CANCELLED: 'Annulée'
    };
    return map[status] ?? status;
  }
}
