import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserRequests {
  constructor(private _httpClient: HttpClient) {}
  getUserRequests(): Observable<any> {
    return this._httpClient.get('http://localhost:3000/user/service-requests');
  }
}
