import { Component, computed, inject, NgModule, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServiceApi } from '../../core/services/service-api/service-api';
import { Daum } from '../../core/interfaces/service/iservice';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-service-details',
  imports: [ReactiveFormsModule, FormsModule, DatePipe, RouterLink],
  templateUrl: './service-details.html',
  styleUrl: './service-details.css',
})
export class ServiceDetails {
  private readonly _route = inject(ActivatedRoute);
  private readonly _serviceApi = inject(ServiceApi);
  private _platformId = inject(PLATFORM_ID);
  private toast = inject(HotToastService);

  service = signal<Daum | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  id: string | null = null;
  stars = [1, 2, 3, 4, 5];
  reviews = signal<any[]>([]);
  isLoading2 = signal<boolean>(true);
  totalReviews = signal<number>(0);
  // Form State
  currentRating = 0;
  commentText = '';
  isSubmitting = signal<boolean>(false);

  averageRating = computed(() => {
    const currentReviews = this.reviews();
    if (currentReviews.length === 0) return 0;

    const sum = currentReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / currentReviews.length).toFixed(1);
  });

  ngOnInit() {
    this.id = this._route.snapshot.paramMap.get('id');

    if (this.id && isPlatformBrowser(this._platformId)) {
      this.fetchServiceDetails(this.id);
      this.fetchReviews();
    } else {
      this.isLoading.set(false);
      this.isLoading2.set(false);
    }
  }

  fetchServiceDetails(id: string) {
    this.isLoading.set(true);

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

  fetchReviews() {
    if (isPlatformBrowser(this._platformId)) {
      this._serviceApi.getServiceReviews(this.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.reviews.set(res.data);
            this.totalReviews.set(res.pagination.total);
          }
          this.isLoading2.set(false);
        },
        error: (err) => {
          this.isLoading2.set(false);
        },
      });
    } else {
      this.isLoading2.set(false);
    }
  }

  setRating(star: number) {
    this.currentRating = star;
  }

  submitRating() {
    if (!this.id) {
      console.error('No ID found');
      return;
    }

    if (this.currentRating === 0) {
      alert('Please select a star rating first');
      return;
    }

    // Verify the exact payload structure your backend expects
    const payload = {
      rating: this.currentRating,
      comment: this.commentText,
    };

    console.log('Sending payload:', payload); // Debugging line
    this.isSubmitting.set(true);
    this._serviceApi
      .postRating(this.id, payload)
      .pipe(
        // THIS IS THE TOAST LOGIC
        this.toast.observe({
          success: 'تم تقييم الخدمة بنجاح',

          error: (err) => 'حاول مره اخره',
        }),
      )

      .subscribe({
        next: (res) => {
          console.log('Success:', res);
          this.resetForm();
          this.isLoading.set(false);
          this.fetchReviews();
        },
        error: (err) => {
          console.error('Full Error Object:', err);
          this.isSubmitting.set(false);

          if (err.status === 401) {
            alert('You must be logged in to rate.');
          } else if (err.status === 400) {
            alert('Invalid data sent.');
          } else {
            alert('Something went wrong.');
          }
        },
      });
  }

  getStars(rating: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => (i < rating ? 1 : 0));
  }

  resetForm() {
    this.currentRating = 0;
    this.commentText = '';
    this.isSubmitting.set(false);
  }
}
