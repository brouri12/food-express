import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md fade-in">
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4">
              <span class="text-3xl">🍽️</span>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h1>
            <p class="text-gray-600">Rejoignez FoodExpress dès aujourd'hui</p>
            <div class="mt-4 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg inline-block">
              🔐 API: User Service — Registration
            </div>
          </div>

          <!-- Role Selection -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-3">Type de compte</label>
            <div class="grid grid-cols-3 gap-2">
              <button type="button" (click)="role = 'CLIENT'"
                      [class]="'py-2 px-3 rounded-lg text-sm font-semibold transition-all ' + (role === 'CLIENT' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700')">
                🛍️ Client
              </button>
              <button type="button" (click)="role = 'LIVREUR'"
                      [class]="'py-2 px-3 rounded-lg text-sm font-semibold transition-all ' + (role === 'LIVREUR' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700')">
                🛵 Livreur
              </button>
              <button type="button" (click)="role = 'RESTAURATEUR'"
                      [class]="'py-2 px-3 rounded-lg text-sm font-semibold transition-all ' + (role === 'RESTAURATEUR' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700')">
                🍴 Restaurant
              </button>
            </div>
          </div>

          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                <input type="text" [(ngModel)]="firstName" name="firstName" required
                       class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                <input type="text" [(ngModel)]="lastName" name="lastName" required
                       class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" [(ngModel)]="email" name="email" required placeholder="votre@email.com"
                     class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
              <input type="tel" [(ngModel)]="phone" name="phone" placeholder="+33 6 12 34 56 78"
                     class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
              <input type="password" [(ngModel)]="password" name="password" required placeholder="••••••••"
                     class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

            <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{{ error }}</div>

            <button type="submit" [disabled]="loading"
                    class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg disabled:opacity-60">
              {{ loading ? 'Création...' : 'Créer mon compte' }}
            </button>
          </form>

          <p class="text-center text-gray-600 mt-6">
            Déjà un compte ?
            <a routerLink="/login" class="text-orange-600 hover:text-orange-700 font-semibold">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  firstName = ''; lastName = ''; email = ''; phone = ''; password = '';
  role = 'CLIENT'; loading = false; error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.auth.register({ email: this.email, password: this.password,
      firstName: this.firstName, lastName: this.lastName, phone: this.phone, role: this.role })
      .subscribe({ next: () => this.router.navigate(['/']), error: () => { this.error = 'Erreur lors de la création du compte'; this.loading = false; } });
  }
}
