import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LocationResponse {
  success: boolean;
  data: {
    nearestLocation: {
      name: string;
      address: string;
      googleMapsLink: string;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class AI {
  private http = inject(HttpClient);
  private apiUrl = 'https://isalny-backend.vercel.app/api/v1/ai/services';

  // Function to send the question to the API
  chat(serviceId: string, question: string): Observable<any> {
    const body = { question: question };
    return this.http.post<any>(`${this.apiUrl}/${serviceId}/chat`, body);
  }

  getNearestLocation(payload: {
    latitude: number;
    longitude: number;
    chatContext: string;
  }): Observable<LocationResponse> {
    return this.http.post<LocationResponse>(
      `https://isalny-backend.vercel.app/api/v1/ai/nearest-location`,
      payload,
    );
  }
}
