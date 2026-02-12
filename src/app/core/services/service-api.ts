import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceApi {
  private apiUrl = 'http://localhost:3000/services';

  constructor(private http: HttpClient){}

  getServices(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl)
  }
}
