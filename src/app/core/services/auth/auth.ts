import { Resetpassword } from './../../../pages/resetpassword/resetpassword';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  otpCode: string = '';

  x!: any;
  decode() {
    if (sessionStorage.getItem('token')) {
      this.x = jwtDecode(sessionStorage.getItem('token')!);
      console.log(this.x);
    }
  }

  constructor(private _HttpClient: HttpClient) {}

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
