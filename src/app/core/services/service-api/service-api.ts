import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceApi {
  constructor(private _HttpClient: HttpClient) {}

  getAllSerivces(): Observable<any> {
    return this._HttpClient.get('https://isalny-backend.vercel.app/api/v1/services');
  }
}
