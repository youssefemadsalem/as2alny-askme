import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';
import { Daum } from '../../core/interfaces/service/iservice';
import { ServiceApi } from '../../core/services/service-api/service-api';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  // Signals for state management
  servicedata = signal<Daum[]>([]);
  isLoading = signal<boolean>(true);
  userName = signal<string>('');

  // Pagination Signals
  currentPage = signal<number>(1);
  totalPages = signal<number>(2);

  itemsPerPage = 6; // This matches your backend default
  pages = signal<number[]>([]);

  skeletonItems = Array(8).fill(0);

  readonly _auth = inject(Auth);
  readonly _router = inject(Router);
  private readonly _ServiceApi = inject(ServiceApi);
  private _CookieService = inject(CookieService);

  pagesArray = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });

  ngOnInit() {
    this.userName.set(this._CookieService.get('userName'));
    this.loadServices();
  }

  loadServices() {
    this.isLoading.set(true);

    // Pass the current page and limit
    this._ServiceApi.getAllSerivces(this.currentPage(), this.itemsPerPage).subscribe({
      next: (res) => {
        this.servicedata.set(res.data);

        // Update pagination signals from response
        if (res.pagination) {
          this.currentPage.set(res.pagination.page);
          this.totalPages.set(res.pagination.totalPages);
          const pagesArray = Array.from({ length: res.pagination.totalPages }, (_, i) => i + 1);
          this.pages.set(pagesArray);
        }

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  // Handle Page Changes
  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.currentPage.set(newPage);
      this.loadServices();

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  handleProtectedNavigate(path: string, id?: string) {
    if (this._auth.isAuthenticated) {
      const fullPath = id ? path.replace(':id', id) : path;
      this._router.navigate([fullPath]);
    } else {
      this._router.navigate(['/login']);
    }
  }
}
