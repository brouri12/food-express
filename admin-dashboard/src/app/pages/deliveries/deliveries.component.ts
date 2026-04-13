import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryService } from '../../services/delivery.service';
import { Delivery, DeliveryStatus, CreateDeliveryRequest } from '../../models/delivery.model';

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

  // Creation modal
  showCreateModal = false;
  creating = false;
  newDelivery: CreateDeliveryRequest = {
    customerId: '',
    restaurantId: '',
    deliveryAddress: ''
  };

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
    if (delivery.id) {
      this.deliveryService.updateStatus(delivery.id, status).subscribe(() => this.load());
    }
  }

  delete(id: number | undefined) {
    if (id && confirm('Supprimer cette livraison ?')) {
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

  // Delivery Creation Methods
  openCreateModal() {
    this.newDelivery = this.getEmptyDelivery();
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.newDelivery = this.getEmptyDelivery();
    this.creating = false;
  }

  createDelivery() {
    if (!this.isValidDelivery()) return;
    
    this.creating = true;
    this.deliveryService.create(this.newDelivery).subscribe({
      next: (newDelivery) => {
        // Add the new delivery to the local list
        this.deliveries.unshift(newDelivery);
        this.applyFilter();
        this.closeCreateModal();
      },
      error: (error) => {
        console.error('Error creating delivery:', error);
        this.creating = false;
      }
    });
  }

  private isValidDelivery(): boolean {
    return !!(
      this.newDelivery.customerId?.trim() &&
      this.newDelivery.restaurantId?.trim() &&
      this.newDelivery.deliveryAddress?.trim()
    );
  }

  private getEmptyDelivery(): CreateDeliveryRequest {
    return {
      customerId: '',
      restaurantId: '',
      deliveryAddress: ''
    };
  }
}
