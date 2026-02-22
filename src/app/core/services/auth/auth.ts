import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // 1. Core Dependencies
  private readonly _HttpClient = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _cookieService = inject(CookieService);

  // 2. State Management
  otpCode: string = '';
  userData = new BehaviorSubject<any>(null);

  constructor() {
    this.decode();
  }

  saveToken(token: string) {
    this._cookieService.set('token', token, 1, '/');
    this.decode();
  }

  get getToken(): string {
    return this._cookieService.get('token');
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
        this._cookieService.delete('token', '/');
      }
    } else {
      this.userData.next(null);
    }
  }

  logOut() {
    this._cookieService.delete('token', '/');
    this.userData.next(null);
    this._router.navigate(['/home']);
  }

  sighin(data: object): Observable<any> {
    return this._HttpClient.post(`https://isalny-backend.vercel.app/api/v1/auth/login`, data);
  }

  sighup(data: object): Observable<any> {
    return this._HttpClient.post(`https://isalny-backend.vercel.app/api/v1/auth/register`, data);
  }

  forget(data: object): Observable<any> {
    return this._HttpClient.post(
      `https://isalny-backend.vercel.app/api/v1/auth/forget-password`,
      data,
    );
  }

  validateotp(data: object): Observable<any> {
    return this._HttpClient.post(
      `https://isalny-backend.vercel.app/api/v1/auth/validate-otp`,
      data,
    );
  }

  Resetpassword(data: object): Observable<any> {
    return this._HttpClient.post(
      `https://isalny-backend.vercel.app/api/v1/auth/reset-password`,
      data,
    );
  }
}
