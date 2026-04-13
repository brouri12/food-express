import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">👥 Gestion des Utilisateurs</h2>
          <p class="text-gray-500 text-sm mt-1">API: user-service → GET /api/users | Keycloak roles</p>
        </div>
      </div>

      <!-- Role Filter -->
      <div class="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
        <button *ngFor="let r of roles"
                (click)="filterRole = r.value"
                [class]="'px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm ' + (filterRole === r.value ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700')">
          {{ r.icon }} {{ r.label }}
        </button>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Utilisateur</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Email</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Rôle</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Statut</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Inscrit le</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let u of filteredUsers()" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                    {{ u.firstName[0] }}{{ u.lastName[0] }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ u.firstName }} {{ u.lastName }}</p>
                    <p class="text-xs text-gray-500">{{ u.phone }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-700 text-sm">{{ u.email }}</td>
              <td class="px-6 py-4">
                <span [class]="'px-2 py-1 rounded-full text-xs font-semibold ' + roleClass(u.role)">
                  {{ roleIcon(u.role) }} {{ u.role }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span [class]="'px-2 py-1 rounded-full text-xs font-semibold ' + (u.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')">
                  {{ u.enabled ? 'Actif' : 'Suspendu' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ u.createdAt }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Voir profil">👁️</button>
                  <button (click)="toggleUser(u)"
                          [class]="'p-2 rounded-lg ' + (u.enabled ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50')"
                          [title]="u.enabled ? 'Suspendre' : 'Activer'">
                    {{ u.enabled ? '🚫' : '✅' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminUsersComponent {
  filterRole = '';

  roles = [
    { value: '', label: 'Tous', icon: '👥' },
    { value: 'CLIENT', label: 'Clients', icon: '🛍️' },
    { value: 'RESTAURATEUR', label: 'Restaurateurs', icon: '🍴' },
    { value: 'LIVREUR', label: 'Livreurs', icon: '🛵' },
    { value: 'ADMIN', label: 'Admins', icon: '⚙️' },
  ];

  users = signal([
    { id: '1', firstName: 'Sophie', lastName: 'Martin', email: 'sophie@email.com', phone: '+33 6 12 34 56 78', role: 'CLIENT', enabled: true, createdAt: '12/01/2026' },
    { id: '2', firstName: 'Marc', lastName: 'Dupont', email: 'marc@email.com', phone: '+33 6 98 76 54 32', role: 'RESTAURATEUR', enabled: true, createdAt: '05/01/2026' },
    { id: '3', firstName: 'Thomas', lastName: 'Dubois', email: 'thomas@email.com', phone: '+33 6 55 44 33 22', role: 'LIVREUR', enabled: true, createdAt: '08/01/2026' },
    { id: '4', firstName: 'Admin', lastName: 'FoodExpress', email: 'admin@foodexpress.com', phone: '+33 1 00 00 00 00', role: 'ADMIN', enabled: true, createdAt: '01/01/2026' },
    { id: '5', firstName: 'Julie', lastName: 'Bernard', email: 'julie@email.com', phone: '+33 6 11 22 33 44', role: 'CLIENT', enabled: false, createdAt: '15/01/2026' },
  ]);

  filteredUsers = () => this.users().filter(u => !this.filterRole || u.role === this.filterRole);

  toggleUser(u: any): void {
    this.users.update(list => list.map(user => user.id === u.id ? { ...user, enabled: !user.enabled } : user));
  }

  roleClass(role: string): string {
    const map: Record<string, string> = {
      CLIENT: 'bg-blue-100 text-blue-700', RESTAURATEUR: 'bg-purple-100 text-purple-700',
      LIVREUR: 'bg-orange-100 text-orange-700', ADMIN: 'bg-red-100 text-red-700',
    };
    return map[role] || 'bg-gray-100 text-gray-700';
  }

  roleIcon(role: string): string {
    return { CLIENT: '🛍️', RESTAURATEUR: '🍴', LIVREUR: '🛵', ADMIN: '⚙️' }[role] || '';
  }
}
