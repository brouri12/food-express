import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 py-10 px-4">
      <div class="max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Mon profil</h1>
        <p class="text-gray-500 text-sm mb-6">Informations de votre compte FoodExpress</p>

        <dl class="space-y-4 text-sm">
          <div class="flex justify-between gap-4 border-b border-gray-100 pb-3">
            <dt class="text-gray-500">Prénom</dt>
            <dd class="font-semibold text-gray-900">{{ auth.currentUser()?.firstName }}</dd>
          </div>
          <div class="flex justify-between gap-4 border-b border-gray-100 pb-3">
            <dt class="text-gray-500">Nom</dt>
            <dd class="font-semibold text-gray-900">{{ auth.currentUser()?.lastName }}</dd>
          </div>
          <div class="flex justify-between gap-4 border-b border-gray-100 pb-3">
            <dt class="text-gray-500">Email</dt>
            <dd class="font-semibold text-gray-900 break-all">{{ auth.currentUser()?.email }}</dd>
          </div>
          <div class="flex justify-between gap-4 pb-1">
            <dt class="text-gray-500">Rôle</dt>
            <dd class="font-semibold text-orange-600">{{ auth.currentUser()?.role }}</dd>
          </div>
        </dl>

        <div class="mt-8 flex flex-col sm:flex-row gap-3">
          <a routerLink="/restaurants"
             class="flex-1 text-center px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
            Parcourir les restaurants
          </a>
          <button type="button" (click)="auth.logout()"
                  class="flex-1 px-4 py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors">
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  constructor(public auth: AuthService) {}
}
