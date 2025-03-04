import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthentication());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  /**
   * Attempt login by sending credentials to /api/auth/login
   */
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>('/api/auth/login', { username, password }).pipe(
      map(res => {
        localStorage.setItem(this.tokenKey, res.token);
        this.isAuthenticatedSubject.next(true);
        return true;
      }),
      catchError(err => {
        this.isAuthenticatedSubject.next(false);
        return throwError(() => err);
      })
    );
  }

  /**
   * Log out
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Synchronous check
   */
  isAuthenticated(): boolean {
    return this.checkAuthentication();
  }

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
