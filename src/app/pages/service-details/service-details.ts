import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceApi } from '../../core/services/service-api/service-api';
import { Daum } from '../../core/interfaces/service/iservice';

@Component({
  selector: 'app-service-details',
  imports: [],
  templateUrl: './service-details.html',
  styleUrl: './service-details.css',
})
export class ServiceDetails {
  private readonly _route = inject(ActivatedRoute);
  private readonly _serviceApi = inject(ServiceApi);

  // State Management with Signals
  service = signal<Daum | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchServiceDetails(id);
    }
  }

  fetchServiceDetails(id: string) {
    this.isLoading.set(true);
    // Assuming you have a getServiceById method in your ServiceApi
    this._serviceApi.getSerivceById(id).subscribe({
      next: (res) => {
        this.service.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('فشل في تحميل بيانات الخدمة');
        this.isLoading.set(false);
        console.error(err);
      },
    });
  }
}
