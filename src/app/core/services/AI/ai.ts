import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
}
