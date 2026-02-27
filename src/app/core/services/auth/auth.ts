import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly _HttpClient = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _cookieService = inject(CookieService);
  private readonly platformId = inject(PLATFORM_ID);

  otpCode: string = '';
  userData = new BehaviorSubject<any>(null);
  private baseUrl = 'https://isalny-backend.vercel.app/api/v1/auth';

  constructor() {
    this.decode();
  }

  saveToken(accessToken: string, refreshToken: string, name: string) {
    if (isPlatformBrowser(this.platformId)) {
      this._cookieService.set('token', accessToken, 1, '/');
      this._cookieService.set('refreshToken', refreshToken, 2, '/');
      this._cookieService.set('userName', name, 1, '/');
      this.decode();
    }
  }

  get getToken(): string {
    return isPlatformBrowser(this.platformId) ? this._cookieService.get('token') : '';
  }

  get getRefreshToken(): string {
    return isPlatformBrowser(this.platformId) ? this._cookieService.get('refreshToken') : '';
  }

  get isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return this._cookieService.check('token');
    }
    return true;
  }

  decode() {
    const token = this.getToken;
    if (token && isPlatformBrowser(this.platformId)) {
      try {
        const decoded = jwtDecode(token);
        this.userData.next(decoded);
      } catch (e) {
        this.logOut();
      }
    } else {
      this.userData.next(null);
    }
  }

  logOut() {
    if (isPlatformBrowser(this.platformId)) {
      this._cookieService.delete('token', '/');
      this._cookieService.delete('refreshToken', '/');
      this._cookieService.delete('userName', '/');
    }
    this.userData.next(null);
    this._router.navigate(['/home']);
  }

  refreshTokens(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) return of(null);

    const refreshToken = this.getRefreshToken;

    if (!refreshToken) {
      this.logOut();
      return throwError(() => new Error('Refresh token missing'));
    }

    return this._HttpClient.post(`${this.baseUrl}/refresh-token`, { refreshToken }).pipe(
      tap((response: any) => {
        // Grab tokens from the "tokens" box
        const newAccess = response?.tokens?.accessToken;
        const newRefresh = response?.tokens?.refreshToken;

        if (newAccess && newRefresh) {
          this.saveToken(newAccess, newRefresh, this._cookieService.get('userName') || '');
        }
      }),
      // ⚠️ IMPORTANT: We must return the response so the Interceptor gets it!
      tap((response) => response),
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
