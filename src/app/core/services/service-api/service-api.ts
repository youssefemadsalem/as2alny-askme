import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Daum, IService } from '../../interfaces/service/iservice';

@Injectable({
  providedIn: 'root',
})
export class ServiceApi {
  private readonly _httpClient = inject(HttpClient);
  private readonly baseUrl = 'https://isalny-backend.vercel.app/api/v1/services';

  // Get all services
  getAllSerivces(): Observable<IService> {
    return this._httpClient.get<IService>(this.baseUrl);
  }

  // Get single service by ID
  getSerivceById(id: string): Observable<{ success: boolean; data: Daum }> {
    return this._httpClient.get<{ success: boolean; data: Daum }>(`${this.baseUrl}/${id}`);
  }

  postRating(serviceId: string, payload: object): Observable<any> {
    return this._httpClient.post(
      `https://isalny-backend.vercel.app/api/v1/ratings/service/${serviceId}`,
      payload,
    );
  }

  getServiceReviews(serviceId: any): Observable<any> {
    return this._httpClient.get<any>(
      `https://isalny-backend.vercel.app/api/v1/ratings/service/${serviceId}`,
    );
  }
}
