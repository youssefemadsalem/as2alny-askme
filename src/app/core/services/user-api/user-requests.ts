import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserRequests {
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

  getUserRequests(): Observable<any> {
    console.log(this.userToken.token);
    return this._httpClient.get('https://isalny-backend.vercel.app/api/v1/user/service-requests', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.userToken.token}`,
      }),
    });
  }

  createServiceRequest(data: any): Observable<any> {
    return this._httpClient.post(
      'https://isalny-backend.vercel.app/api/v1/user/service-requests',
      data,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.userToken.token}`,
        }),
      },
    );
  }
}
