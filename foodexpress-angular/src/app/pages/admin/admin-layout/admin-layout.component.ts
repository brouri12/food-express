import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="flex h-screen bg-gray-100 overflow-hidden">
      <!-- Sidebar -->
      <aside [class]="'flex flex-col bg-gray-900 text-white transition-all duration-300 ' + (collapsed ? 'w-16' : 'w-64')">
        <!-- Logo -->
        <div class="flex items-center gap-3 p-4 border-b border-gray-700">
          <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-xl">🍽️</span>
          </div>
          <span *ngIf="!collapsed" class="font-bold text-lg text-white">FoodExpress</span>
          <button (click)="collapsed = !collapsed" class="ml-auto text-gray-400 hover:text-white">
            {{ collapsed ? '→' : '←' }}
          </button>
        </div>

        <!-- Admin badge -->
        <div *ngIf="!collapsed" class="px-4 py-3 border-b border-gray-700">
          <div class="bg-orange-500/20 border border-orange-500/30 rounded-lg px-3 py-2">
            <p class="text-orange-400 text-xs font-semibold">⚙️ PANNEAU ADMIN</p>
          </div>
        </div>

        <!-- Nav -->
        <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
          <a *ngFor="let item of navItems" [routerLink]="item.path" routerLinkActive="bg-orange-500 text-white"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <span class="text-xl flex-shrink-0">{{ item.icon }}</span>
            <span *ngIf="!collapsed" class="font-medium text-sm">{{ item.label }}</span>
          </a>
        </nav>

        <!-- Footer -->
        <div class="p-3 border-t border-gray-700">
          <a routerLink="/" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <span class="text-xl">🏠</span>
            <span *ngIf="!collapsed" class="font-medium text-sm">Retour au site</span>
          </a>
        </div>
      </aside>

      <!-- Main -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top bar -->
        <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-900">Dashboard Administrateur</h1>
            <p class="text-sm text-gray-500">Gestion de la plateforme FoodExpress</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Spring Cloud Gateway</span>
            <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-y-auto p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  collapsed = false;

  navItems = [
    { path: '/admin/restaurants', icon: '🏪', label: 'Restaurants' },
  ];
}
