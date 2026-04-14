import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { API } from './api.config';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'fe_token';
  private readonly USER_KEY  = 'fe_user';

  currentUser = signal<AuthResponse | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API.AUTH_LOGIN, req).pipe(
      tap(res => this.saveSession(res))
    );
  }

  /**
   * Inscription réelle vers le user-service. Si le backend est injoignable (pas de Docker, mauvais port),
   * status HTTP 0 → session locale de démo (même principe que le login admin sans API).
   */
  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API.AUTH_REGISTER, req).pipe(
      tap(res => this.saveSession(res)),
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse && err.status === 0) {
          const res = this.offlineRegisterResponse(req);
          this.saveSession(res);
          return of(res);
        }
        return throwError(() => err);
      })
    );
  }

  private offlineRegisterResponse(req: RegisterRequest): AuthResponse {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return {
      token: `offline-${id}`,
      userId: `local-${id}`,
      email: req.email,
      role: req.role,
      firstName: req.firstName,
      lastName: req.lastName
    };
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  private saveSession(res: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res));
    this.currentUser.set(res);
  }

  private loadUser(): AuthResponse | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
