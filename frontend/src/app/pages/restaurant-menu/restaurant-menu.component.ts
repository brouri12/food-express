import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant, MenuDto, MenuItem } from '../../models/restaurant.model';
import { RatingService } from '../../services/rating.service';
import { CreateRatingRequest, Rating } from '../../models/rating.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

interface CartItem { item: MenuItem; qty: number; }

@Component({
  selector: 'app-restaurant-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './restaurant-menu.component.html'
})
export class RestaurantMenuComponent implements OnInit {
  ratingForm!: FormGroup;
  ratings$ = new BehaviorSubject<Rating[]>([]);
  hasRated$ = new BehaviorSubject<boolean>(false);
  showRatingForm = false;
  restaurantId!: number;
  restaurant: Restaurant | null = null;
  menu: MenuDto | null = null;
  cart: CartItem[] = [];
  loading = true;
  activeCategory = 0;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private ratingService: RatingService,
    private fb: FormBuilder
  ) {
    // Rating form
    this.ratingForm = this.fb.group({
      note: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      commentaire: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit() {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      restaurant: this.restaurantService.getById(this.restaurantId),
      menu: this.restaurantService.getMenu(this.restaurantId)
    }).subscribe({
      next: ({ restaurant, menu }) => {
        this.restaurant = restaurant;
        this.menu = menu;
        this.loading = false;
        this.loadRatings();
        this.checkIfRated();
      },
      error: () => { this.loading = false; }
    });
  }

  loadRatings() {
    this.ratingService.getRatingsByRestaurant(this.restaurantId).subscribe(ratings => {
      this.ratings$.next(ratings);
    });
  }

  checkIfRated() {
    // Mock: check if user already rated (use auth service + API later)
    this.hasRated$.next(false);
  }

  submitRating() {
    if (this.ratingForm.valid && this.restaurant) {
      const formValue = this.ratingForm.value as CreateRatingRequest;
      const ratingData: CreateRatingRequest = {
        restaurantId: this.restaurantId,
        note: formValue.note,
        commentaire: formValue.commentaire
      };

      this.ratingService.createRating(ratingData).subscribe({
        next: () => {
          this.showRatingForm = false;
          this.ratingForm.reset({ note: 5 });
          this.loadRatings();
          this.hasRated$.next(true);
          // Reload restaurant for new average
          this.restaurantService.getById(this.restaurantId).subscribe(r => this.restaurant = r);
          // Show success toast
        },
        error: (err) => console.error('Rating error', err)
      });
    }
  }

  loadMoreRatings() {
    console.log('Load more ratings...');
    // TODO: Implement pagination
  }

  addToCart(item: MenuItem) {
    const existing = this.cart.find(c => c.item.id === item.id);
    if (existing) existing.qty++;
    else this.cart.push({ item, qty: 1 });
  }

  removeFromCart(item: MenuItem) {
    const idx = this.cart.findIndex(c => c.item.id === item.id);
    if (idx === -1) return;
    if (this.cart[idx].qty > 1) this.cart[idx].qty--;
    else this.cart.splice(idx, 1);
  }

  getQty(item: MenuItem): number {
    return this.cart.find(c => c.item.id === item.id)?.qty ?? 0;
  }

  get total(): number {
    return this.cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  }

  get cartCount(): number {
    return this.cart.reduce((sum, c) => sum + c.qty, 0);
  }
}
