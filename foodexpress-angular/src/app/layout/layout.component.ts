import { Component, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header Desktop -->
      <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <a routerLink="/" class="flex items-center gap-2">
              <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-xl">🍽️</span>
              </div>
              <span class="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                FoodExpress
              </span>
            </a>

            <!-- Nav Desktop -->
            <nav class="hidden md:flex items-center gap-6">
              <a routerLink="/" routerLinkActive="text-orange-600 bg-orange-50"
                 [routerLinkActiveOptions]="{exact:true}"
                 class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:text-orange-600 hover:bg-gray-50">
                🏠 Accueil
              </a>
              <a routerLink="/restaurants" routerLinkActive="text-orange-600 bg-orange-50"
                 class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:text-orange-600 hover:bg-gray-50">
                🏪 Restaurants
              </a>
              <a routerLink="/orders" routerLinkActive="text-orange-600 bg-orange-50"
                 class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:text-orange-600 hover:bg-gray-50">
                📦 Mes commandes
              </a>
              <a *ngIf="auth.isAdmin()" routerLink="/admin" routerLinkActive="text-orange-600 bg-orange-50"
                 class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:text-orange-600 hover:bg-gray-50">
                ⚙️ Admin
              </a>
              <a *ngIf="auth.isDriver()" routerLink="/driver" routerLinkActive="text-orange-600 bg-orange-50"
                 class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:text-orange-600 hover:bg-gray-50">
                🛵 Mes livraisons
              </a>
              <a *ngIf="auth.isRestaurateur()" routerLink="/restaurant-dashboard" routerLinkActive="text-orange-600 bg-orange-50"
                 class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:text-orange-600 hover:bg-gray-50">
                🍽️ Mon Restaurant
              </a>
            </nav>

            <!-- Actions -->
            <div class="flex items-center gap-3">
              <a routerLink="/cart" class="relative p-2 text-gray-700 hover:text-orange-600 rounded-lg transition-colors">
                🛒
                <span *ngIf="cartCount() > 0"
                      class="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {{ cartCount() }}
                </span>
              </a>

              <ng-container *ngIf="auth.isLoggedIn(); else guestActions">
                <!-- User menu avec dropdown (click) -->
                <div class="relative">
                  <button (click)="showMenu = !showMenu"
                          class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-md">
                    👤 {{ auth.currentUser()?.firstName }}
                    <span class="text-xs opacity-80">{{ showMenu ? '▴' : '▾' }}</span>
                  </button>
                  <!-- Overlay transparent pour fermer en cliquant ailleurs -->
                  <div *ngIf="showMenu"
                       class="fixed inset-0 z-40"
                       (click)="showMenu = false"></div>
                  <!-- Dropdown -->
                  <div *ngIf="showMenu"
                       class="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <a routerLink="/orders" (click)="showMenu=false"
                       class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      📦 Mes commandes
                    </a>
                    <a *ngIf="auth.isAdmin()" routerLink="/admin" (click)="showMenu=false"
                       class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      ⚙️ Dashboard Admin
                    </a>
                    <a *ngIf="auth.isDriver()" routerLink="/driver" (click)="showMenu=false"
                       class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      🛵 Mes livraisons
                    </a>
                    <a *ngIf="auth.isRestaurateur()" routerLink="/restaurant-dashboard" (click)="showMenu=false"
                       class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      🍽️ Mon Restaurant
                    </a>
                    <div class="border-t border-gray-100 my-1"></div>
                    <button (click)="logout()"
                            class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      🚪 Se déconnecter
                    </button>
                  </div>
                </div>
              </ng-container>
              <ng-template #guestActions>
                <a routerLink="/login" class="text-gray-700 font-medium hover:text-orange-600 px-3 py-2 hidden md:block">
                  Connexion
                </a>
                <a routerLink="/signup"
                   class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all hidden md:block">
                  S'inscrire
                </a>
              </ng-template>
            </div>
          </div>
        </div>
      </header>

      <!-- Main -->
      <main class="pb-20 md:pb-0">
        <router-outlet></router-outlet>
      </main>

      <!-- Bottom Nav Mobile -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        <div class="flex items-center justify-around h-16 px-4">
          <a routerLink="/" routerLinkActive="text-orange-600" [routerLinkActiveOptions]="{exact:true}"
             class="flex flex-col items-center gap-1 py-2 px-3 text-gray-600">
            <span>🏠</span><span class="text-xs font-medium">Accueil</span>
          </a>
          <a routerLink="/restaurants" routerLinkActive="text-orange-600"
             class="flex flex-col items-center gap-1 py-2 px-3 text-gray-600">
            <span>🏪</span><span class="text-xs font-medium">Restaurants</span>
          </a>
          <a routerLink="/cart" routerLinkActive="text-orange-600"
             class="relative flex flex-col items-center gap-1 py-2 px-3 text-gray-600">
            <span>🛒</span>
            <span *ngIf="cartCount() > 0"
                  class="absolute -top-1 right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {{ cartCount() }}
            </span>
            <span class="text-xs font-medium">Panier</span>
          </a>
          <a routerLink="/profile" routerLinkActive="text-orange-600"
             class="flex flex-col items-center gap-1 py-2 px-3 text-gray-600">
            <span>👤</span><span class="text-xs font-medium">Profil</span>
          </a>
          <button *ngIf="auth.isLoggedIn()" (click)="logout()"
                  class="flex flex-col items-center gap-1 py-2 px-3 text-red-500">
            <span>🚪</span><span class="text-xs font-medium">Quitter</span>
          </button>
        </div>
      </nav>
    </div>
  `
})
export class LayoutComponent {
  cartCount = this.cart.count;
  showMenu = false;

  constructor(public cart: CartService, public auth: AuthService) {}

  logout(): void {
    this.showMenu = false;
    this.auth.logout();
  }
}
