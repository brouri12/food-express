import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a routerLink="/" class="flex items-center gap-2">
              <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-xl">🍽️</span>
              </div>
              <span class="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                FoodExpress
              </span>
            </a>
            <nav class="flex items-center gap-4">
              <a routerLink="/restaurants" routerLinkActive="text-orange-600 bg-orange-50"
                 class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:text-orange-600 hover:bg-gray-50">
                🏪 Restaurants
              </a>
              <a routerLink="/admin" routerLinkActive="text-orange-600 bg-orange-50"
                 class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:text-orange-600 hover:bg-gray-50">
                ⚙️ Admin
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class LayoutComponent {}
