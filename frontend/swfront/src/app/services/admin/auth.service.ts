import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_SECRET = environment.jwtSecret;
  private readonly tokenKey = 'auth_token';
  private readonly adminUsername = environment.authConfig.adminUsername;
  private readonly adminPassword = environment.authConfig.adminPassword;

  // Create a new instance of the service
  private jwtHelperInstance = new JwtHelperService();

  // Initialize subject AFTER the helper is created
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthentication());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  constructor(private jwtHelper: JwtHelperService) {
    this.checkTokenValidity();
  }

  /**
   * Authenticates the admin user
   */
  login(username: string, password: string): Observable<boolean> {
    // Simple authentication for single admin user
    if (username === this.adminUsername && password === this.adminPassword) {
      // Create a proper JWT token
      const token = this.generateJWT();
      localStorage.setItem(this.tokenKey, token);
      
      this.isAuthenticatedSubject.next(true);
      return of(true);
    } else {
      return throwError(() => new Error('Invalid credentials'));
    }
  }

  /**
   * Logs out the admin user
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  // Use our own implementation that doesn't rely on JwtHelperService
  private checkAuthentication(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return false;
    
    try {
      // Simple check for token expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch (e) {
      return false;
    }
  }

  /**
   * Checks if the user is authenticated
   */
  isAuthenticated(): boolean {
    return this.checkAuthentication();
  }

  /**
   * Checks token validity and logs out if invalid
   */
  private checkTokenValidity(): void {
    if (!this.isAuthenticated()) {
      this.logout();
    }
  }

  /**
   * Generates a JWT token
   */
  private generateJWT(): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const payload = {
      sub: this.adminUsername,
      name: 'Admin User',
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours from now
    };
    
    const headerBase64 = btoa(JSON.stringify(header));
    const payloadBase64 = btoa(JSON.stringify(payload));
    const signature = this.generateSignature(`${headerBase64}.${payloadBase64}`);
    
    return `${headerBase64}.${payloadBase64}.${signature}`;
  }

  /**
   * Generates a signature for the JWT
   */
  private generateSignature(data: string): string {
    // This is a simplified implementation - not secure for production
    return btoa(data + this.JWT_SECRET);
  }
}
