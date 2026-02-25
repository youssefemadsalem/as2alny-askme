import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';
import { IService, Daum } from '../../core/interfaces/service/iservice';
import { ServiceApi } from '../../core/services/service-api/service-api';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  standalone: true, // Explicitly standalone
  imports: [CommonModule], // Removed FormsModule as it wasn't used in the logic shown
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  // Signals for state management
  servicedata = signal<Daum[]>([]);
  isLoading = signal<boolean>(true); // Start as true
  userName = signal<string>('');

  // Dummy array to render 8 skeleton cards
  skeletonItems = Array(8).fill(0);

  readonly _auth = inject(Auth);
  readonly _router = inject(Router);
  private readonly _ServiceApi = inject(ServiceApi);
  private _CookieService = inject(CookieService);

  ngOnInit() {
    this.userName.set(this._CookieService.get('userName'));
    this.loadServices();
  }

  loadServices() {
    this.isLoading.set(true); // Ensure loading is true before fetch

    this._ServiceApi.getAllSerivces().subscribe({
      next: (res) => {
        // Delay simulation (Optional: remove setTimeout in production)
        // setTimeout(() => {
        this.servicedata.set(res.data);
        this.isLoading.set(false);
        // }, 1000);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  handleProtectedNavigate(path: string, id?: string) {
    if (this._auth.isAuthenticated) {
      // Logic to handle params (assuming simple append for now based on your code)
      const fullPath = id ? path.replace(':id', id) : path;
      this._router.navigate([fullPath]);
    } else {
      this._router.navigate(['/login']);
    }
  }
}
