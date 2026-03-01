import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';
import { Daum } from '../../core/interfaces/service/iservice';
import { ServiceApi } from '../../core/services/service-api/service-api';
import { CookieService } from 'ngx-cookie-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  // Signals for state management
  servicedata = signal<Daum[]>([]);
  isLoading = signal<boolean>(true);
  userName = signal<string>('');
  isSearching = signal<boolean>(false);

  // Pagination Signals
  currentPage = signal<number>(1);
  totalPages = signal<number>(2);

  itemsPerPage = 8; // This matches your backend default
  pages = signal<number[]>([]);

  skeletonItems = Array(8).fill(0);
  searchControl = new FormControl('');
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
    this.setupSearch();
  }

  setupSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500), // Wait 500ms after user stops typing
        distinctUntilChanged(), // Only if value changed
        tap((term) => {
          this.isLoading.set(true);
          // If term exists, we are in search mode, otherwise normal mode
          this.isSearching.set(!!term);
        }),
        switchMap((term) => {
          if (!term) {
            // If empty, load default page 1
            this.currentPage.set(1);
            return this._ServiceApi
              .getAllSerivces(1, this.itemsPerPage)
              .pipe(map((res) => ({ data: res.data, pagination: res.pagination })));
          } else {
            // If has text, call search endpoint
            return this._ServiceApi.searchServices(term).pipe(
              map((res) => ({ data: res.data, pagination: null })), // Map to unify structure
              catchError((err) => {
                console.error(err);
                return of({ data: [], pagination: null });
              }),
            );
          }
        }),
      )
      .subscribe({
        next: (res) => {
          this.servicedata.set(res.data);

          // Only update pagination if we are NOT searching
          if (res.pagination && !this.isSearching()) {
            this.totalPages.set(res.pagination.totalPages);
            const pagesArray = Array.from({ length: res.pagination.totalPages }, (_, i) => i + 1);
            this.pages.set(pagesArray);
          }

          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error(err);
        },
      });
  }

  loadServices() {
    this.isLoading.set(true);
    if (this.isSearching()) return;
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
