import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserData {
  constructor(private _httpClient:HttpClient){

  }
  getUserData():Observable<any>{
    return this._httpClient.get('http://localhost:3000/services')
  }
  
}
