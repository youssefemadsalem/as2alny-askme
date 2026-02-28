import { DatePipe, Location, NgClass } from '@angular/common';
import { ServiceApi } from './../../core/services/service-api/service-api';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-comments',
  imports: [NgClass, DatePipe],
  templateUrl: './all-comments.html',
  styleUrl: './all-comments.css',
})
export class AllComments {
  // --- Injections ---
  private _location = inject(Location);
  private _route = inject(ActivatedRoute);
  private _service = inject(ServiceApi); // Use your actual service name

  // --- Signals ---
  isLoading = signal<boolean>(true);
  reviews = signal<any[]>([]);

  // --- Computed Analytics ---
  totalReviews = computed(() => this.reviews().length);

  averageRating = computed(() => {
    const total = this.reviews().reduce((acc, curr) => acc + curr.rating, 0);
    return this.totalReviews() > 0 ? (total / this.totalReviews()).toFixed(1) : '0.0';
  });

  ratingDistribution = computed(() => {
    // Initialize counters
    const dist: any = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    this.reviews().forEach((r) => {
      // Ensure rating is valid (1-5)
      const rounded = Math.round(r.rating || 0);
      if (rounded >= 1 && rounded <= 5) {
        dist[rounded]++;
      }
    });
    return dist;
  });

  ngOnInit() {
    // 1. Get 'id' from the route parameters (e.g., /comments/:id)
    const serviceId = this._route.snapshot.paramMap.get('id');

    if (serviceId) {
      this.fetchReviews(serviceId);
    } else {
      console.error('No Service ID found in route');
      this.isLoading.set(false);
    }
  }

  fetchReviews(id: string) {
    this._service.getServiceReviews(id).subscribe({
      next: (response: any) => {
        // 👇 Check your API response structure.
        // If the API returns { data: [...] }, change this to response.data
        // If it returns [...] directly, keep it as response.
        const data = Array.isArray(response) ? response : response.data || [];

        this.reviews.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Error fetching reviews:', err);
        this.isLoading.set(false);
      },
    });
  }

  goBack() {
    this._location.back();
  }

  // --- Helpers ---

  getStars(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.round(rating));
    }
    return stars;
  }

  getPercentage(count: number): string {
    if (this.totalReviews() === 0) return '0%';
    return `${(count / this.totalReviews()) * 100}%`;
  }
}
