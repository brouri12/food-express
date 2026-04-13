import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { PromotionService } from '../../services/promotion.service';
import { PromoApplyResult } from '../../models/promotion.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Empty Cart -->
        <div *ngIf="cart.count() === 0" class="flex items-center justify-center min-h-[60vh]">
          <div class="text-center">
            <div class="text-6xl mb-4">🛒</div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
            <p class="text-gray-600 mb-6">Découvrez nos restaurants et ajoutez des plats délicieux !</p>
            <a routerLink="/restaurants"
               class="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg">
              Découvrir les restaurants
            </a>
          </div>
        </div>

        <ng-container *ngIf="cart.count() > 0">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Mon Panier</h1>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">API: Order Service</span>
              <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">API: Promotion Service</span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Items + Promo -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Items -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Articles ({{ cart.count() }})</h2>
                <div class="space-y-4">
                  <div *ngFor="let item of cart.items()"
                       class="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                    <img [src]="item.image" [alt]="item.name" class="w-20 h-20 object-cover rounded-lg" />
                    <div class="flex-1">
                      <h3 class="font-semibold text-gray-900">{{ item.name }}</h3>
                      <p class="text-sm text-gray-600">{{ item.restaurantName }}</p>
                      <p class="text-orange-600 font-bold mt-1">{{ item.price | number:'1.2-2' }}€</p>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button (click)="cart.updateQuantity(item.id, -1)"
                                class="p-1 hover:bg-white rounded transition-colors">−</button>
                        <span class="font-semibold text-gray-900 px-2">{{ item.quantity }}</span>
                        <button (click)="cart.updateQuantity(item.id, 1)"
                                class="p-1 hover:bg-white rounded transition-colors">+</button>
                      </div>
                      <button (click)="cart.remove(item.id)"
                              class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Promo Code -->
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center gap-2 mb-4">
                  <span>🏷️</span>
                  <h2 class="text-xl font-bold text-gray-900">Code Promo</h2>
                  <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Promotion Service</span>
                </div>
                <div *ngIf="promoResult(); else promoInput">
                  <div class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p class="font-semibold text-green-700">✓ Code appliqué !</p>
                      <p class="text-sm text-green-600">-{{ promoResult()!.discount | number:'1.2-2' }}€</p>
                    </div>
                    <button (click)="promoResult.set(null)" class="text-green-600 font-semibold">Retirer</button>
                  </div>
                </div>
                <ng-template #promoInput>
                  <div class="flex gap-2 mb-4">
                    <input type="text" [(ngModel)]="promoCode" placeholder="Entrez votre code"
                           class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <button (click)="applyPromo()"
                            class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
                      Appliquer
                    </button>
                  </div>
                  <p *ngIf="promoError" class="text-red-500 text-sm mb-3">{{ promoError }}</p>
                  <div class="space-y-2">
                    <p class="text-sm font-semibold text-gray-700">Codes disponibles :</p>
                    <button (click)="promoCode = 'BIENVENUE20'"
                            class="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                      <p class="font-semibold text-orange-600 text-sm">BIENVENUE20</p>
                      <p class="text-xs text-gray-600">-20% sur votre première commande</p>
                    </button>
                    <button (click)="promoCode = 'LIVRAISON0'"
                            class="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                      <p class="font-semibold text-orange-600 text-sm">LIVRAISON0</p>
                      <p class="text-xs text-gray-600">Livraison gratuite dès 25€</p>
                    </button>
                  </div>
                </ng-template>
              </div>
            </div>

            <!-- Summary -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-xl shadow-sm p-6 sticky top-20">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Résumé de la commande</h2>
                <div class="space-y-3 mb-6">
                  <div class="flex justify-between text-gray-700">
                    <span>Sous-total</span>
                    <span class="font-semibold">{{ cart.subtotal() | number:'1.2-2' }}€</span>
                  </div>
                  <div class="flex justify-between text-gray-700">
                    <span>Livraison</span>
                    <span class="font-semibold">{{ deliveryFee | number:'1.2-2' }}€</span>
                  </div>
                  <div *ngIf="promoResult()" class="flex justify-between text-green-600">
                    <span>Réduction</span>
                    <span class="font-semibold">-{{ promoResult()!.discount | number:'1.2-2' }}€</span>
                  </div>
                  <div class="pt-3 border-t border-gray-200 flex justify-between">
                    <span class="font-bold text-gray-900 text-lg">Total</span>
                    <span class="font-bold text-orange-600 text-lg">{{ total() | number:'1.2-2' }}€</span>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Adresse de livraison</label>
                  <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Maison - 15 Rue de la Paix</option>
                    <option>Bureau - 42 Avenue des Champs</option>
                  </select>
                </div>
                <div class="mb-6">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Moyen de paiement</label>
                  <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Visa •••• 4242</option>
                    <option>Mastercard •••• 5555</option>
                  </select>
                </div>

                <button (click)="checkout()"
                        class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg flex items-center justify-center gap-2">
                  Commander →
                </button>
                <p class="text-xs text-gray-500 text-center mt-4">En commandant, vous acceptez nos conditions</p>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `
})
export class CartComponent {
  promoCode = '';
  promoError = '';
  promoResult = signal<PromoApplyResult | null>(null);
  deliveryFee = 2.50;

  total = () => {
    const sub = this.cart.subtotal() + this.deliveryFee;
    const disc = this.promoResult()?.discount ?? 0;
    return Math.max(0, sub - disc);
  };

  constructor(public cart: CartService, private promotionService: PromotionService) {}

  applyPromo(): void {
    this.promoError = '';
    this.promotionService.applyCode(this.promoCode, this.cart.subtotal()).subscribe({
      next: res => this.promoResult.set(res),
      error: err => this.promoError = err.message || 'Code promo invalide'
    });
  }

  checkout(): void {
    this.cart.clear();
    window.location.href = '/delivery/order-2';
  }
}
