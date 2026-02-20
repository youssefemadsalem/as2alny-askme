import { Resetpassword } from './../../../pages/resetpassword/resetpassword';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  otpCode: string = '';
  userData = new BehaviorSubject<any>(null);
  x!: any;
  private readonly _router = inject(Router);

  decode() {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        this.userData.next(decoded);
      } catch (e) {
        this.userData.next(null);
      }
    } else {
      this.userData.next(null);
    }
  }

  constructor(private _HttpClient: HttpClient) {
    if (typeof sessionStorage !== 'undefined') {
      this.decode();
    }
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

  logOut() {
    sessionStorage.removeItem('token');
    this.userData.next(null);
    this._router.navigate(['/home']);
  }
}
