import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryService } from '../../services/delivery.service';
import { Driver } from '../../models/delivery.model';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drivers.component.html'
})
export class DriversComponent implements OnInit {
  drivers: Driver[] = [];
  loading = true;
  showForm = false;
  editingDriver: Partial<Driver> = {};
  isEditing = false;

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.deliveryService.getAllDrivers().subscribe({
      next: (data) => { this.drivers = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openCreate() {
    this.editingDriver = { available: true, rating: 5.0 };
    this.isEditing = false;
    this.showForm = true;
  }

  openEdit(driver: Driver) {
    this.editingDriver = { ...driver };
    this.isEditing = true;
    this.showForm = true;
  }

  save() {
    if (this.isEditing && this.editingDriver.id) {
      this.deliveryService.updateDriver(this.editingDriver.id, this.editingDriver).subscribe(() => {
        this.showForm = false;
        this.load();
      });
    } else {
      this.deliveryService.createDriver(this.editingDriver).subscribe(() => {
        this.showForm = false;
        this.load();
      });
    }
  }

  delete(id: number) {
    if (confirm('Supprimer ce livreur ?')) {
      this.deliveryService.deleteDriver(id).subscribe(() => this.load());
    }
  }
}
