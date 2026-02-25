import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly _HttpClient = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _cookieService = inject(CookieService);

  otpCode: string = '';
  userData = new BehaviorSubject<any>(null);

  // Centralized API URL for cleaner code
  private baseUrl = 'https://isalny-backend.vercel.app/api/v1/auth';

  constructor() {
    this.decode();
  }

  // --- 1. MODIFIED: Now saves both tokens ---
  saveToken(accessToken: string, refreshToken: string, name: string) {
    this._cookieService.set('token', accessToken, 1, '/');
    this._cookieService.set('refreshToken', refreshToken, 2, '/'); // Valid for 2 days
    this._cookieService.set('userName', name, 1, '/');
    this.decode();
  }

  get getToken(): string {
    return this._cookieService.get('token');
  }

  // --- 2. NEW: Get the refresh token ---
  get getRefreshToken(): string {
    return this._cookieService.get('refreshToken');
  }

  get isAuthenticated(): boolean {
    return this._cookieService.check('token');
  }

  decode() {
    const token = this.getToken;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        this.userData.next(decoded);
      } catch (e) {
        this.userData.next(null);
        // Clean up everything if decoding fails
        this._cookieService.delete('token', '/');
        this._cookieService.delete('refreshToken', '/');
        this._cookieService.delete('userName', '/');
      }
    } else {
      this.userData.next(null);
    }
  }

  logOut() {
    // --- 3. MODIFIED: Clear all cookies ---
    this._cookieService.delete('token', '/');
    this._cookieService.delete('refreshToken', '/');
    this._cookieService.delete('userName', '/');
    this.userData.next(null);
    this._router.navigate(['/home']);
  }

  // --- 4. NEW: The Refresh API Call ---
  refreshTokens(): Observable<any> {
    const refreshToken = this.getRefreshToken;

    // NOTE: Ask your friend for the exact endpoint name.
    // I assumed it is '/refresh-token' based on standard naming.
    return this._HttpClient.post(`${this.baseUrl}/refresh-token`, { refreshToken }).pipe(
      tap((response: any) => {
        // Automatically update cookies when we get new tokens
        if (response.data) {
          this.saveToken(
            response.data.accessToken,
            response.data.refreshToken,
            this._cookieService.get('userName'),
          );
        }
      }),
    );
  }

  // --- Auth Methods ---

  sighin(data: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/login`, data);
  }

  sighup(data: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/register`, data);
  }

  forget(data: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/forget-password`, data);
  }

  validateotp(data: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/validate-otp`, data);
  }

  Resetpassword(data: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/reset-password`, data);
  }
}
