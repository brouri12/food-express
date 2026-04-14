import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Promotion } from '../../models/promotion.model';
import { SafeImgPipe } from '../safe-img.pipe';

@Component({
  selector: 'app-promo-carousel',
  standalone: true,
  imports: [CommonModule, SafeImgPipe],
  template: `
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          ✨ Offres Spéciales
        </h2>
        <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">API: Promotion Service</span>
      </div>

      <div class="relative overflow-hidden rounded-2xl shadow-xl group" *ngIf="promotions.length">
        <div class="relative h-64 md:h-80 transition-all duration-500">
          <img [src]="(current.imageUrl || current.image) | safeImg:'promo'"
               [alt]="current.title"
               (error)="$any($event.target).src='https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop'"
               class="w-full h-full object-cover transition-opacity duration-500" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            <h3 class="text-2xl md:text-4xl font-bold mb-2">{{ current.title }}</h3>
            <p class="text-lg md:text-xl mb-4">{{ current.description }}</p>
            <div *ngIf="current.code"
                 class="inline-block bg-white text-gray-900 px-4 py-2 rounded-lg font-bold">
              Code : {{ current.code }}
            </div>
          </div>
        </div>

        <button (click)="prev()"
                class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          ‹
        </button>
        <button (click)="next()"
                class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          ›
        </button>
      </div>

      <div class="flex justify-center gap-2 mt-4">
        <button *ngFor="let p of promotions; let i = index"
                (click)="goTo(i)"
                [class]="'h-2 rounded-full transition-all duration-300 ' + (i === currentIndex ? 'bg-orange-500 w-8' : 'bg-gray-300 w-2')">
        </button>
      </div>
    </section>
  `
})
export class PromoCarouselComponent implements OnInit, OnDestroy {
  @Input() promotions: Promotion[] = [];
  currentIndex = 0;
  private timer: any;

  get current(): Promotion { return this.promotions[this.currentIndex]; }

  ngOnInit(): void {
    this.timer = setInterval(() => this.next(), 4000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.promotions.length;
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.promotions.length) % this.promotions.length;
  }

  goTo(i: number): void {
    this.currentIndex = i;
  }
}
