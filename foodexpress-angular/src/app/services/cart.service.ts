import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/delivery.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly KEY = 'fe_cart';
  items = signal<CartItem[]>(this.load());

  count = computed(() => this.items().reduce((s, i) => s + i.quantity, 0));
  subtotal = computed(() => this.items().reduce((s, i) => s + i.price * i.quantity, 0));

  add(item: Omit<CartItem, 'quantity'>): void {
    const current = this.items();
    const existing = current.find(i => i.id === item.id);
    if (existing) {
      this.items.set(current.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      this.items.set([...current, { ...item, quantity: 1 }]);
    }
    this.save();
  }

  updateQuantity(id: string, delta: number): void {
    this.items.set(
      this.items().map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
               .filter(i => i.quantity > 0)
    );
    this.save();
  }

  remove(id: string): void {
    this.items.set(this.items().filter(i => i.id !== id));
    this.save();
  }

  clear(): void {
    this.items.set([]);
    this.save();
  }

  private save(): void {
    localStorage.setItem(this.KEY, JSON.stringify(this.items()));
  }

  private load(): CartItem[] {
    const raw = localStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : [];
  }
}
