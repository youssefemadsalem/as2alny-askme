import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  userToken: any;

  constructor(
    private _httpClient: HttpClient,
    @Inject(PLATFORM_ID) private _PLATFORM_ID: any,
    private _cookieService: CookieService,
  ) {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.userToken = { token: this._cookieService.get('token') };
    } else {
      this.userToken = {};
    }
  }

  getUserData(): Observable<any> {
    return this._httpClient.get('https://isalny-backend.vercel.app/api/v1/user/profile', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.userToken.token}`,
      }),
    });
  }
  updateUserData(data: any): Observable<any> {
    return this._httpClient.patch('https://isalny-backend.vercel.app/api/v1/user/profile', data, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.userToken.token}`,
      }),
    });
  }

  deleteUserImage(): Observable<any> {
    return this._httpClient.delete('https://isalny-backend.vercel.app/api/v1/user/profile/image', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.userToken.token}`,
      }),
    });
  }


}
