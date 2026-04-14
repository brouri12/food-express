import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { RatingService } from '../../services/rating.service';
import { AuthService } from '../../services/auth.service';
import { Restaurant } from '../../models/restaurant.model';
import { MenuItem } from '../../models/menu.model';
import { Rating, CreateRatingRequest } from '../../models/rating.model';
import { SafeImgPipe } from '../../shared/safe-img.pipe';

@Component({
  selector: 'app-restaurant-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SafeImgPipe],
  template: `
    <div class="min-h-screen bg-gray-50" *ngIf="restaurant()">
      <!-- Toast panier -->
      <div *ngIf="showToast"
           class="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 fade-in">
        🛒 Ajouté au panier !
      </div>
      <!-- Toast rating -->
      <div *ngIf="showRatingToast"
           class="fixed top-20 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 fade-in">
        ⭐ Merci pour votre avis !
      </div>

      <!-- Hero Image -->
      <div class="relative h-64 md:h-80 bg-gray-900">
        <img [src]="(restaurant()!.imageUrl || restaurant()!.image) | safeImg:'restaurant'"
             [alt]="restaurant()!.name"
             class="w-full h-full object-cover opacity-80" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <a routerLink="/restaurants"
           class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white transition-all">
          ← Retour
        </a>
        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div class="max-w-7xl mx-auto">
            <span *ngIf="restaurant()!.promoted && restaurant()!.discount"
                  class="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-3">
              🔥 -{{ restaurant()!.discount }}% de réduction
            </span>
            <h1 class="text-3xl md:text-4xl font-bold mb-3">{{ restaurant()!.name }}</h1>
            <div class="flex flex-wrap items-center gap-4 text-sm md:text-base">
              <!-- Rating display -->
              <div class="flex items-center gap-1">
                <span class="text-yellow-400 text-lg">
                  <ng-container *ngFor="let s of [1,2,3,4,5]; let i=index">
                    <span [class.text-yellow-400]="i < (ratingAverage?.average || 0)"
                          [class.text-gray-400]="i >= (ratingAverage?.average || 0)">★</span>
                  </ng-container>
                </span>
                <span class="font-semibold">{{ ratingAverage?.average | number:'1.1-1' }}</span>
                <span class="text-white/80">({{ ratingAverage?.count || 0 }} avis)</span>
              </div>
              <div class="flex items-center gap-1 text-white/90">🕐 {{ restaurant()!.deliveryTime }} min</div>
              <div class="flex items-center gap-1 text-white/90">📍 {{ restaurant()!.deliveryFee | number:'1.2-2' }}€</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Nav -->
      <div class="sticky top-16 bg-white border-b border-gray-200 z-40 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">API: Menu Service</span>
            <button (click)="selectedCat = null"
                    [class]="'px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ' + (!selectedCat ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700')">
              Tout le menu
            </button>
            <button *ngFor="let cat of menuCategories()"
                    (click)="selectedCat = cat"
                    [class]="'px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ' + (selectedCat === cat ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700')">
              {{ cat }}
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Menu Items -->
          <div class="lg:col-span-2 space-y-8">

            <!-- ⭐ RATINGS SECTION ─────────────────────────────── -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                  ⭐ Avis clients
                  <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-normal">
                    API: Rating Service
                  </span>
                </h2>
                <button *ngIf="!hasRated && !showRatingForm"
                        (click)="showRatingForm = true"
                        class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all text-sm">
                  + Laisser un avis
                </button>
                <div *ngIf="hasRated" class="text-green-600 text-sm font-semibold flex items-center gap-1">
                  ✅ Vous avez noté ce restaurant
                </div>
              </div>

              <!-- Rating Form -->
              <div *ngIf="showRatingForm && !hasRated"
                   class="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-5">
                <h3 class="font-bold text-gray-900 mb-4">⭐ Noter ce restaurant</h3>
                <!-- Star picker -->
                <div class="mb-4">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Note</label>
                  <div class="flex gap-1">
                    <button *ngFor="let s of [1,2,3,4,5]; let i=index"
                            type="button"
                            (click)="newRating.note = i + 1"
                            class="text-3xl transition-transform hover:scale-110 cursor-pointer">
                      <span [class.text-yellow-400]="newRating.note > i"
                            [class.text-gray-300]="newRating.note <= i">★</span>
                    </button>
                    <span class="ml-2 text-gray-600 self-center font-semibold">{{ newRating.note }}/5</span>
                  </div>
                </div>
                <!-- Comment -->
                <div class="mb-4">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Commentaire (optionnel)</label>
                  <textarea [(ngModel)]="newRating.commentaire" rows="3" maxlength="500"
                            placeholder="Que pensez-vous de ce restaurant ?"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"></textarea>
                  <p class="text-xs text-gray-400 mt-1">{{ (newRating.commentaire || '').length }}/500</p>
                </div>
                <div class="flex gap-3">
                  <button (click)="showRatingForm = false"
                          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Annuler
                  </button>
                  <button (click)="submitRating()"
                          [disabled]="submittingRating"
                          class="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-60">
                    {{ submittingRating ? 'Envoi...' : 'Envoyer' }}
                  </button>
                </div>
                <p *ngIf="ratingError" class="text-red-500 text-sm mt-2">{{ ratingError }}</p>
              </div>

              <!-- Ratings list -->
              <div *ngIf="ratings().length > 0" class="space-y-3 max-h-80 overflow-y-auto">
                <div *ngFor="let r of ratings()"
                     class="border border-gray-100 rounded-lg p-4 hover:border-orange-200 transition-colors">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="flex gap-0.5">
                      <span *ngFor="let s of [1,2,3,4,5]; let i=index"
                            [class.text-yellow-400]="i < r.note"
                            [class.text-gray-300]="i >= r.note"
                            class="text-lg">★</span>
                    </div>
                    <span class="text-sm font-semibold text-gray-700">{{ r.note }}/5</span>
                    <span class="text-xs text-gray-400 ml-auto">{{ r.dateCreation | date:'dd/MM/yyyy' }}</span>
                  </div>
                  <p *ngIf="r.commentaire" class="text-gray-700 text-sm">{{ r.commentaire }}</p>
                  <p class="text-xs text-gray-400 mt-1">👤 {{ r.userId }}</p>
                </div>
              </div>
              <div *ngIf="ratings().length === 0 && !loadingRatings"
                   class="text-center py-6 text-gray-400">
                <div class="text-4xl mb-2">⭐</div>
                <p class="text-sm">Aucun avis pour l'instant. Soyez le premier !</p>
              </div>
              <div *ngIf="loadingRatings" class="text-center py-4">
                <div class="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
            <!-- ─────────────────────────────────────────────────── -->

            <!-- Menu items -->
            <ng-container *ngFor="let entry of displayedMenu()">
              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ entry.category }}</h2>
                <div class="space-y-4">
                  <div *ngFor="let item of entry.items"
                       [class]="'bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all ' + (!item.available ? 'opacity-60' : '')">
                    <div class="flex gap-4 p-4">
                      <div class="flex-1">
                        <div class="flex items-start gap-2 mb-2">
                          <h4 class="font-semibold text-gray-900 flex-1">{{ item.name }}</h4>
                          <span *ngIf="item.popular" class="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">⭐ Populaire</span>
                          <span *ngIf="item.vegetarian" class="text-green-600 text-sm">🌿</span>
                          <!-- Happy Hour badge -->
                          <span *ngIf="item.happyHourActive"
                                class="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                            🎉 -{{ item.happyHourDiscountPercent }}% Happy Hour
                          </span>
                        </div>
                        <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ item.description }}</p>
                        <div class="flex items-center justify-between">
                          <div>
                            <span class="font-bold text-lg text-gray-900">{{ item.price | number:'1.2-2' }}€</span>
                            <!-- Happy Hour: show original price crossed out -->
                            <span *ngIf="item.happyHourActive"
                                  class="ml-2 text-sm text-gray-400 line-through">{{ item.originalPrice | number:'1.2-2' }}€</span>
                          </div>
                          <button *ngIf="item.available" (click)="addToCart(item)"
                                  class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-md">
                            +
                          </button>
                          <span *ngIf="!item.available" class="text-gray-400 text-sm">Indisponible</span>
                        </div>
                      </div>
                      <div class="w-24 h-24 flex-shrink-0">
                        <img [src]="(item.imageUrl || item.image) | safeImg:'menu'"
                             [alt]="item.name"
                             class="w-full h-full object-cover rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ng-container>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-sm p-6 sticky top-40">
              <h3 class="font-bold text-gray-900 mb-4">ℹ️ Informations</h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Commande minimum</span>
                  <span class="font-semibold">{{ restaurant()!.minOrder }}€</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Frais de livraison</span>
                  <span class="font-semibold">{{ restaurant()!.deliveryFee | number:'1.2-2' }}€</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Temps de livraison</span>
                  <span class="font-semibold">{{ restaurant()!.deliveryTime }} min</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Note moyenne</span>
                  <span class="font-semibold text-orange-600">
                    ⭐ {{ ratingAverage?.average | number:'1.1-1' }} ({{ ratingAverage?.count || 0 }})
                  </span>
                </div>
              </div>
              <a *ngIf="cartCount() > 0" routerLink="/cart"
                 class="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md flex items-center justify-center gap-2 block text-center">
                🛒 Voir le panier ({{ cartCount() }})
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div *ngIf="!restaurant()" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Chargement...</p>
      </div>
    </div>
  `
})
export class RestaurantMenuComponent implements OnInit {
  restaurant = signal<Restaurant | null>(null);
  menuData = signal<Record<string, MenuItem[]>>({});
  selectedCat: string | null = null;
  showToast = false;
  cartCount = this.cart.count;

  // Rating state
  ratings = signal<Rating[]>([]);
  ratingAverage: { average: number; count: number; restaurantId: string } | null = null;
  loadingRatings = false;
  showRatingForm = false;
  showRatingToast = false;
  hasRated = false;
  submittingRating = false;
  ratingError = '';
  newRating: CreateRatingRequest = { restaurantId: '', note: 5, commentaire: '' };

  menuCategories = () => Object.keys(this.menuData());

  displayedMenu = () => {
    const data = this.menuData();
    const cats = this.selectedCat ? [this.selectedCat] : Object.keys(data);
    return cats.map(cat => ({ category: cat, items: data[cat] || [] }));
  };

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private menuService: MenuService,
    private cart: CartService,
    private ratingService: RatingService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.newRating.restaurantId = id;

    this.restaurantService.getById(id).subscribe(r => this.restaurant.set(r));
    this.menuService.getByRestaurant(id).subscribe(data => this.menuData.set(data));
    this.loadRatings(id);
    this.loadAverage(id);
  }

  loadRatings(restaurantId: string): void {
    this.loadingRatings = true;
    this.ratingService.getRatingsByRestaurant(restaurantId).subscribe(data => {
      this.ratings.set(data);
      this.loadingRatings = false;
      // Vérifier si l'utilisateur courant a déjà noté
      const userId = this.auth.currentUser()?.userId;
      if (userId) {
        this.hasRated = data.some(r => r.userId === userId);
      }
    });
  }

  loadAverage(restaurantId: string): void {
    this.ratingService.getAverageByRestaurant(restaurantId).subscribe(avg => {
      this.ratingAverage = avg;
    });
  }

  submitRating(): void {
    if (!this.newRating.note || this.newRating.note < 1 || this.newRating.note > 5) {
      this.ratingError = 'La note doit être entre 1 et 5';
      return;
    }
    this.submittingRating = true;
    this.ratingError = '';
    const userId = this.auth.currentUser()?.userId;

    this.ratingService.createRating(this.newRating, userId).subscribe({
      next: () => {
        this.submittingRating = false;
        this.showRatingForm = false;
        this.hasRated = true;
        this.showRatingToast = true;
        setTimeout(() => this.showRatingToast = false, 3000);
        // Recharger les avis et la moyenne
        const id = this.route.snapshot.paramMap.get('id')!;
        this.loadRatings(id);
        this.loadAverage(id);
        this.newRating = { restaurantId: id, note: 5, commentaire: '' };
      },
      error: (err) => {
        this.submittingRating = false;
        this.ratingError = err.error || 'Erreur lors de l\'envoi de l\'avis';
      }
    });
  }

  addToCart(item: MenuItem): void {
    const r = this.restaurant()!;
    this.cart.add({
      id: item.id,
      restaurantId: r.id,
      restaurantName: r.name,
      name: item.name,
      price: item.price,                          // effective price (discounted if happy hour)
      originalPrice: item.originalPrice,
      happyHour: item.happyHourActive,
      image: item.image || item.imageUrl || '',
    });
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }
}
