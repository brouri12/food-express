import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DeliveryService } from '../../services/delivery.service';
import { OrderService } from '../../services/order.service';
import { Order, ORDER_STATUS_LABELS } from '../../models/order.model';

interface TimelineStep {
  status: string;
  label: string;
  time: string;
  completed: boolean;
  active: boolean;
}

@Component({
  selector: 'app-delivery-tracking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Header -->
        <div class="mb-8 flex items-center gap-4">
          <a routerLink="/orders" class="text-gray-500 hover:text-orange-600 transition-colors">← Retour</a>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">🛵 Suivi de livraison</h1>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-sm text-gray-500">Commande #{{ orderId }}</span>
              <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">API: Delivery Service</span>
              <span *ngIf="order()" [class]="statusClass(order()!.status)"
                    class="text-xs px-2 py-1 rounded-full font-semibold">
                {{ statusLabel(order()!.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div *ngIf="loading()" class="flex justify-center py-16">
          <div class="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div *ngIf="!loading()" class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Map + ETA -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
              <!-- Carte simulée -->
              <div class="relative h-80 md:h-96 bg-gradient-to-br from-blue-50 to-green-50">
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center p-8">
                    <div class="text-5xl mb-3">🗺️</div>
                    <p class="text-gray-700 font-semibold">Suivi en temps réel</p>
                    <p class="text-sm text-gray-500 mt-1">Restaurant → Chez vous</p>
                  </div>
                </div>
                <!-- Markers animés -->
                <div class="absolute top-16 left-1/4 animate-bounce">
                  <div class="bg-blue-500 text-white px-3 py-2 rounded-full shadow-lg text-sm font-bold">🏪 Restaurant</div>
                </div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
                  <div class="bg-orange-500 text-white px-3 py-2 rounded-full shadow-lg text-sm font-bold">🛵 Livreur</div>
                </div>
                <div class="absolute bottom-16 right-1/4">
                  <div class="bg-green-500 text-white px-3 py-2 rounded-full shadow-lg text-sm font-bold">🏠 Vous</div>
                </div>
                <!-- Ligne de trajet -->
                <svg class="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                  <line x1="25%" y1="20%" x2="50%" y2="50%" stroke="#f97316" stroke-width="2" stroke-dasharray="8,4"/>
                  <line x1="50%" y1="50%" x2="75%" y2="80%" stroke="#22c55e" stroke-width="2" stroke-dasharray="8,4"/>
                </svg>
              </div>

              <!-- ETA Banner -->
              <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-white/80 mb-1">Arrivée estimée</p>
                    <p class="text-4xl font-bold">{{ eta() }} <span class="text-xl font-normal">min</span></p>
                    <p class="text-sm text-white/70 mt-1">{{ deliveryRange }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-5xl">🕐</div>
                    <p class="text-sm text-white/80 mt-1">{{ deliveryFee }}€ livraison</p>
                  </div>
                </div>
              </div>

              <!-- Détails commande -->
              <div *ngIf="order()" class="p-6 border-t border-gray-100">
                <h3 class="font-bold text-gray-900 mb-3">📦 Détails de la commande</h3>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Restaurant</span>
                    <span class="font-semibold">{{ order()!.restaurantName }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Adresse</span>
                    <span class="font-semibold text-right max-w-48">{{ order()!.deliveryAddress }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Total</span>
                    <span class="font-bold text-orange-600">{{ order()!.totalAmount | number:'1.2-2' }}€</span>
                  </div>
                  <div *ngIf="order()!.items?.length" class="pt-2 border-t border-gray-100">
                    <div *ngFor="let item of order()!.items" class="flex justify-between text-xs text-gray-600 py-0.5">
                      <span>{{ item.quantity }}× {{ item.menuItemName }}</span>
                      <span>{{ item.subtotal | number:'1.2-2' }}€</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-6">

            <!-- Timeline statut -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-5">Statut de la commande</h2>
              <div class="space-y-1">
                <div *ngFor="let step of timeline(); let i = index" class="flex items-start gap-3">
                  <div class="flex flex-col items-center">
                    <div [class]="'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ' +
                      (step.completed ? 'bg-green-500' : step.active ? 'bg-orange-500 animate-pulse' : 'bg-gray-200')">
                      <span *ngIf="step.completed" class="text-white text-sm font-bold">✓</span>
                      <span *ngIf="step.active && !step.completed" class="text-white text-xs">●</span>
                    </div>
                    <div *ngIf="i < timeline().length - 1"
                         [class]="'w-0.5 h-10 mt-1 ' + (step.completed ? 'bg-green-400' : 'bg-gray-200')"></div>
                  </div>
                  <div class="flex-1 pt-1 pb-2">
                    <p [class]="'font-semibold text-sm ' + (step.completed ? 'text-gray-900' : step.active ? 'text-orange-600' : 'text-gray-400')">
                      {{ step.label }}
                    </p>
                    <p *ngIf="step.time" class="text-xs text-gray-400">{{ step.time }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Livreur -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Votre livreur</h2>
              <div class="flex items-center gap-4 mb-4">
                <div class="w-14 h-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center text-2xl">🛵</div>
                <div>
                  <p class="font-bold text-gray-900">{{ driverName }}</p>
                  <div class="flex items-center gap-1 text-yellow-500 text-sm">
                    ★★★★★ <span class="text-gray-500 ml-1">4.9</span>
                  </div>
                  <p class="text-xs text-gray-500">Scooter électrique</p>
                </div>
              </div>
              <button class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
                📞 Contacter le livreur
              </button>
            </div>

            <!-- Calcul livraison (Delivery Service) -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                🧮 Calcul livraison
                <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-normal">Haversine</span>
              </h2>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Distance</span>
                  <span class="font-semibold">{{ distanceKm }} km</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Frais de livraison</span>
                  <span class="font-semibold text-orange-600">{{ deliveryFee }}€</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Temps estimé</span>
                  <span class="font-semibold">{{ deliveryRange }}</span>
                </div>
              </div>
            </div>

            <!-- Support -->
            <div class="bg-orange-50 rounded-xl p-5 border border-orange-200">
              <p class="font-semibold text-gray-900 mb-1">Besoin d'aide ?</p>
              <p class="text-sm text-gray-600 mb-3">Support disponible 7j/7</p>
              <button class="w-full bg-white text-orange-600 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-orange-300 text-sm">
                Contacter le support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DeliveryTrackingComponent implements OnInit, OnDestroy {
  orderId = '';
  eta = signal(30);
  loading = signal(true);
  order = signal<Order | null>(null);
  timeline = signal<TimelineStep[]>([]);

  // Delivery info from delivery-service
  deliveryFee = '2.50';
  distanceKm = '3.2';
  deliveryRange = '25-35 min';
  driverName = 'Thomas Dubois';

  private timer: any;

  constructor(
    private route: ActivatedRoute,
    private deliveryService: DeliveryService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';

    // Charger la commande depuis order-service
    const numId = parseInt(this.orderId);
    if (!isNaN(numId)) {
      this.orderService.getOrderById(numId).subscribe({
        next: (o) => {
          this.order.set(o);
          this.buildTimeline(o.status);
          this.loading.set(false);

          // Calculer les frais via delivery-service (Haversine)
          this.deliveryService.calculate(48.8606, 2.3376, 48.8566, 2.3522).subscribe(calc => {
            this.deliveryFee = calc.deliveryFee?.toFixed(2) || '2.50';
            this.distanceKm = calc.distanceKm?.toFixed(1) || '3.2';
            this.deliveryRange = calc.displayRange || '25-35 min';
            this.eta.set(calc.estimatedTime || 30);
          });
        },
        error: () => {
          // Fallback avec données mock
          this.buildTimeline('ON_THE_WAY');
          this.loading.set(false);
        }
      });
    } else {
      // orderId non numérique (ex: order-demo-001) → fallback mock
      this.buildTimeline('ON_THE_WAY');
      this.loading.set(false);
    }

    // Décrémenter l'ETA chaque minute
    this.timer = setInterval(() => this.eta.update(v => Math.max(0, v - 1)), 60000);
  }

  ngOnDestroy(): void { clearInterval(this.timer); }

  private buildTimeline(currentStatus: string): void {
    const steps = [
      { status: 'PENDING',    label: 'Commande reçue',          icon: '📋' },
      { status: 'CONFIRMED',  label: 'Commande confirmée',       icon: '✅' },
      { status: 'PREPARING',  label: 'En préparation',           icon: '👨‍🍳' },
      { status: 'READY',      label: 'Prête à être récupérée',   icon: '📦' },
      { status: 'ON_THE_WAY', label: 'En route vers vous',       icon: '🛵' },
      { status: 'DELIVERED',  label: 'Livrée !',                 icon: '🎉' },
    ];

    const order = ['PENDING','CONFIRMED','PREPARING','READY','ON_THE_WAY','DELIVERED'];
    const currentIdx = order.indexOf(currentStatus);

    this.timeline.set(steps.map((s, i) => ({
      status:    s.status,
      label:     `${s.icon} ${s.label}`,
      time:      i <= currentIdx ? this.getStepTime(i) : '',
      completed: i < currentIdx,
      active:    i === currentIdx,
    })));
  }

  private getStepTime(idx: number): string {
    const now = new Date();
    const offset = (4 - idx) * 5; // minutes ago
    const t = new Date(now.getTime() - offset * 60000);
    return t.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  statusLabel(status: string): string {
    return ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status;
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
