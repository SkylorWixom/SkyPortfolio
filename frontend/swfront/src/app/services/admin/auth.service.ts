import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Store admin credentials (in a real app, these would be stored securely on the server)
  private adminUsername = 'admin';
  private adminPassword = 'securepassword'; // Change this to something secure!
  
  // JWT helper
  private jwtHelper = new JwtHelperService();
  private JWT_SECRET = 'your-secure-secret-key-change-this'; // Secret key for JWT

  // Observable for authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  constructor() {
    // Check token validity on service initialization
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
      localStorage.setItem('admin_token', token);
      
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
    localStorage.removeItem('admin_token');
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Checks if the user is authenticated
   */
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /**
   * Validates if there's a valid token in local storage
   */
  private hasValidToken(): boolean {
    const token = localStorage.getItem('admin_token');
    
    if (!token) return false;
    
    // Check if token is expired using the JWT helper
    return !this.jwtHelper.isTokenExpired(token);
  }

  /**
   * Checks if the token is still valid
   */
  private checkTokenValidity(): void {
    if (!this.hasValidToken()) {
      this.logout();
    }
  }

  /**
   * Generates a proper JWT token
   */
  private generateJWT(): string {
    const payload = {
      username: this.adminUsername,
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours expiration
    };
    
    // Use the JWT library to create a token
    return this.jwtHelper.tokenGetter(payload, this.JWT_SECRET);
  }
}
