import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak: Keycloak | null = null;
  private authStatus$ = new BehaviorSubject<boolean>(false);

  async init(): Promise<boolean> {
    this.keycloak = new Keycloak({
      url: 'http://localhost:9090',
      realm: 'foodexpress',
      clientId: 'foodexpress-client'
    });

    try {
      console.log('Initializing Keycloak...');
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        redirectUri: window.location.origin,
        flow: 'standard',
        responseMode: 'fragment'
      });

      console.log('Keycloak initialized, authenticated:', authenticated);
      this.authStatus$.next(authenticated);
      return authenticated;
    } catch (error) {
      console.error('Keycloak init error:', error);
      // Don't fail completely - allow app to work even if Keycloak init fails
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.keycloak?.authenticated || false;
  }

  /**
   * Get user roles
   */
  getUserRoles(): string[] {
    if (!this.keycloak?.realmAccess) return [];
    return this.keycloak.realmAccess.roles || [];
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  /**
   * Login user
   */
  login(): void {
    if (this.keycloak) {
      this.keycloak.login({
        redirectUri: window.location.origin + '/dashboard'
      }).catch(error => {
        console.error('Login error:', error);
      });
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    if (this.keycloak) {
      this.keycloak.logout({
        redirectUri: window.location.origin
      });
    }
  }

  /**
   * Register new user
   */
  register(): void {
    if (this.keycloak) {
      this.keycloak.login({
        action: 'register',
        redirectUri: window.location.origin + '/dashboard'
      }).catch(error => {
        console.error('Registration error:', error);
      });
    }
  }

  /**
   * Get access token
   */
  getToken(): string {
    return this.keycloak?.token || '';
  }

  /**
   * Get user info from token
   */
  getUserInfo(): any {
    return this.keycloak?.tokenParsed;
  }

  /**
   * Get user preferred username
   */
  getUsername(): string {
    return this.keycloak?.tokenParsed?.['preferred_username'] || '';
  }

  /**
   * Get user name
   */
  getUserName(): string {
    return this.keycloak?.tokenParsed?.['given_name'] || this.getUsername() || 'User';
  }

  /**
   * Get user email
   */
  getUserEmail(): string {
    return this.keycloak?.tokenParsed?.['email'] || '';
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<boolean> {
    if (!this.keycloak) return false;
    try {
      return await this.keycloak.updateToken(30);
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  /**
   * Get auth status
   */
  getAuthStatus() {
    return this.authStatus$;
  }

  /**
   * Get Keycloak instance
   */
  getKeycloak(): Keycloak | null {
    return this.keycloak;
  }
}
