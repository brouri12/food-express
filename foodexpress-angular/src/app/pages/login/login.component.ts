import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Bon retour !</h1>
            <p class="text-gray-600">Connectez-vous pour commander vos plats préférés</p>
            <div class="mt-4 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg inline-block">
              🔐 API: User Service — Authentication
            </div>
          </div>

          <form (ngSubmit)="onSubmit()" #f="ngForm" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                <input type="email" name="email" [(ngModel)]="email" required
                       placeholder="votre@email.com"
                       class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input [type]="showPwd ? 'text' : 'password'" name="password" [(ngModel)]="password" required
                       placeholder="••••••••"
                       class="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <button type="button" (click)="showPwd = !showPwd"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {{ showPwd ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {{ error }}
            </div>

            <button type="submit" [disabled]="loading"
                    class="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg disabled:opacity-60">
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </form>

          <div class="flex items-center gap-4 my-6">
            <div class="flex-1 h-px bg-gray-200"></div>
            <span class="text-gray-500 text-sm">ou</span>
            <div class="flex-1 h-px bg-gray-200"></div>
          </div>

          <!-- Demo accounts -->
          <div class="bg-blue-50 rounded-xl p-4 mb-4">
            <p class="text-sm font-semibold text-blue-800 mb-2">🧪 Comptes de démonstration :</p>
            <div class="space-y-1 text-xs text-blue-700">
              <p>Admin : admin&#64;foodexpress.com / admin123</p>
              <p>Client : client&#64;foodexpress.com / client123</p>
            </div>
          </div>

          <p class="text-center text-gray-600">
            Pas encore de compte ?
            <a routerLink="/signup" class="text-orange-600 hover:text-orange-700 font-semibold">Créer un compte</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  showPwd = false;
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        // Fallback demo: allow admin login locally
        if (this.email === 'admin@foodexpress.com' && this.password === 'admin123') {
          const fakeAdmin = { token: 'demo-token', userId: 'admin-1', email: this.email,
            role: 'ADMIN', firstName: 'Admin', lastName: 'FoodExpress' };
          localStorage.setItem('fe_token', fakeAdmin.token);
          localStorage.setItem('fe_user', JSON.stringify(fakeAdmin));
          this.auth.currentUser.set(fakeAdmin);
          this.router.navigate(['/admin']);
        } else {
          this.error = 'Email ou mot de passe incorrect';
          this.loading = false;
        }
      }
    });
  }
}
