import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DeliveryService } from '../../services/delivery.service';
import { mockDelivery } from '../../data/mock.data';

@Component({
  selector: 'app-delivery-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Suivi de livraison</h1>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Commande #{{ orderId }}</span>
            <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">API: Delivery Service</span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Map -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div class="relative h-96 md:h-[500px] bg-gradient-to-br from-blue-100 to-green-100">
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center p-8">
                    <div class="text-6xl mb-4">📍</div>
                    <p class="text-gray-700 font-semibold mb-2">Carte interactive en temps réel</p>
                    <p class="text-sm text-gray-600">Position du livreur • Trajet optimisé • ETA dynamique</p>
                  </div>
                </div>
                <!-- Animated markers -->
                <div class="absolute top-20 left-1/4 animate-bounce">
                  <div class="bg-blue-500 text-white p-3 rounded-full shadow-lg">🏪</div>
                </div>
                <div class="absolute top-1/2 left-1/3 animate-pulse">
                  <div class="bg-orange-500 text-white p-3 rounded-full shadow-lg">🛵</div>
                </div>
                <div class="absolute bottom-20 right-1/4">
                  <div class="bg-green-500 text-white p-3 rounded-full shadow-lg">🏠</div>
                </div>
              </div>
              <!-- ETA Banner -->
              <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-white/80 mb-1">Arrivée estimée</p>
                    <p class="text-3xl font-bold">{{ eta() }} minutes</p>
                  </div>
                  <span class="text-5xl">🕐</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Timeline -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Statut de la commande</h2>
              <div class="space-y-4">
                <div *ngFor="let step of timeline; let i = index" class="flex items-start gap-3">
                  <div class="flex flex-col items-center">
                    <div [class]="'w-8 h-8 rounded-full flex items-center justify-center ' + (step.completed ? 'bg-green-500' : i === firstPending ? 'bg-orange-500 animate-pulse' : 'bg-gray-200')">
                      <span *ngIf="step.completed" class="text-white text-sm">✓</span>
                      <div *ngIf="!step.completed" class="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div *ngIf="i < timeline.length - 1"
                         [class]="'w-0.5 h-12 ' + (step.completed ? 'bg-green-500' : 'bg-gray-200')"></div>
                  </div>
                  <div class="flex-1 pt-1">
                    <p [class]="'font-semibold ' + (step.completed ? 'text-gray-900' : 'text-gray-500')">{{ step.label }}</p>
                    <p *ngIf="step.time" class="text-sm text-gray-500">{{ step.time }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Driver -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Votre livreur</h2>
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl">🛵</div>
                <div>
                  <p class="font-bold text-gray-900">Thomas Dubois</p>
                  <p class="text-sm text-yellow-500">★ 4.9</p>
                  <p class="text-sm text-gray-600">Scooter</p>
                </div>
              </div>
              <button class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
                📞 Contacter le livreur
              </button>
            </div>

            <!-- Support -->
            <div class="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <p class="font-semibold text-gray-900 mb-2">Besoin d'aide ?</p>
              <p class="text-sm text-gray-600 mb-4">Notre équipe support est disponible 7j/7</p>
              <button class="w-full bg-white text-orange-600 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-orange-300">
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
  eta = signal(15);
  timeline = mockDelivery.timeline;
  firstPending = this.timeline.findIndex(s => !s.completed);
  private timer: any;

  constructor(private route: ActivatedRoute, private deliveryService: DeliveryService) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';
    this.deliveryService.getByOrder(this.orderId).subscribe(d => {
      if (d?.estimatedMinutes) this.eta.set(d.estimatedMinutes);
    });
    this.timer = setInterval(() => this.eta.update(v => Math.max(0, v - 1)), 60000);
  }

  ngOnDestroy(): void { clearInterval(this.timer); }
}
