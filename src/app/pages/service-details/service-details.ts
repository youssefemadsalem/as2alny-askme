import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServiceApi } from '../../core/services/service-api/service-api';
import { Daum } from '../../core/interfaces/service/iservice';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePipe, isPlatformBrowser, CommonModule } from '@angular/common';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, DatePipe, RouterLink, CommonModule],
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
  currentRating = signal(0);
  hoverRating = signal(0);

  reviews = signal<any[]>([]);
  isLoading2 = signal<boolean>(true);
  totalReviews = signal<number>(0);
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
      },
    });
  }

  setHover(star: number) {
    this.hoverRating.set(star);
  }

  clearHover() {
    this.hoverRating.set(0);
  }

  setRating(star: number) {
    this.currentRating.set(star);
  }

  submitRating() {
    if (!this.id) {
      console.error('No ID found');
      return;
    }

    const ratingValue = this.currentRating();

    if (ratingValue === 0) {
      this.toast.error('عليك ان تقيم من خلال النجوم');
      return;
    }

    const payload = {
      rating: ratingValue,
      comment: this.commentText,
    };

    this.isSubmitting.set(true);

    this._serviceApi
      .postRating(this.id, payload)
      .pipe(
        this.toast.observe({
          loading: 'جاري الإرسال...',
          success: 'تم تقييم الخدمة بنجاح',
          error: 'حدث خطأ أثناء الإرسال',
        }),
      )
      .subscribe({
        next: (res) => {
          this.resetForm();
          this.fetchReviews();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          console.error(err);
        },
        complete: () => {
          this.isSubmitting.set(false);
        },
      });
  }

  resetForm() {
    this.commentText = '';
    this.currentRating.set(0);
    this.isSubmitting.set(false);
  }

  fetchReviews() {
    if (isPlatformBrowser(this._platformId)) {
      this._serviceApi.getServiceReviews(this.id!).subscribe({
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

  getStars(rating: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => (i < rating ? 1 : 0));
  }
}
