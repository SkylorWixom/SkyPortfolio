import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token'; // localStorage key for JWT
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  constructor(private http: HttpClient) {
    // Initialize BehaviorSubject based on whether a valid token is present
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthentication());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  /**
   * Sends credentials to the server’s /api/auth/login route.
   * If valid, we store the returned token and mark isAuthenticated as true.
   */
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>('/api/auth/login', { username, password }).pipe(
      map(res => {
        // Save token in localStorage
        localStorage.setItem(this.tokenKey, res.token);

        // Mark user as authenticated
        this.isAuthenticatedSubject.next(true);
        return true;
      }),
      catchError(err => {
        // If server returns 401 or other error, credentials are invalid
        this.isAuthenticatedSubject.next(false);
        return throwError(() => err);
      })
    );
  }

  /**
   * Logs out the user by removing the stored token and setting isAuthenticated to false
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Used by route guards or components to check auth status synchronously
   */
  isAuthenticated(): boolean {
    return this.checkAuthentication();
  }

  /**
   * Retrieves token from localStorage and checks if it's not expired
   */
  private checkAuthentication(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return false;

    try {
      // decode the JWT payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      // check if exp is still in the future
      return payload.exp > (Date.now() / 1000);
    } catch (e) {
      return false;
    }
  }
}
