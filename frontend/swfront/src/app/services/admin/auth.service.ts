import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';              // localStorage key
  private isAuthenticatedSubject: BehaviorSubject<boolean>;

  // Expose an observable for other components to subscribe to
  public isAuthenticated$: Observable<boolean>;

  constructor(private http: HttpClient) {
    // Initialize BehaviorSubject based on current token validity
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthentication());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  /**
   * Attempt login by sending credentials to the server.
   * On success, store the returned JWT in localStorage.
   */
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>('/api/auth/login', { username, password }).pipe(
      map(res => {
        // Server response contains { token: '...' }
        localStorage.setItem(this.tokenKey, res.token);

        // Mark as authenticated
        this.isAuthenticatedSubject.next(true);
        return true;
      }),
      catchError(err => {
        // If server returns 401 or error, the credentials are invalid
        this.isAuthenticatedSubject.next(false);
        return throwError(() => err);
      })
    );
  }

  /**
   * Logs out by removing the JWT and updating isAuthenticated$
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Synchronous check used by components / route guards if needed
   */
  isAuthenticated(): boolean {
    return this.checkAuthentication();
  }

  /**
   * 1) Retrieve token from localStorage
   * 2) Decode payload to check if it's still valid (exp > now)
   */
  private checkAuthentication(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    } catch (e) {
      return false;
    }
  }
}
