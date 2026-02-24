import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';
// Import Daum alongside IService so we can type the array correctly
import { IService, Daum } from '../../core/interfaces/service/iservice';
import { ServiceApi } from '../../core/services/service-api/service-api';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  servicedata: Daum[] = [];
  userName: string = '';

  readonly _auth = inject(Auth);
  readonly _router = inject(Router);
  private readonly _ServiceApi = inject(ServiceApi);
  private _CookieService = inject(CookieService);

  ngOnInit() {
    this.userName = this._CookieService.get('userName');
    this._ServiceApi.getAllSerivces().subscribe({
      next: (res) => {
        this.servicedata = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  handleProtectedNavigate(path: string, id?: string) {
    if (this._auth.isAuthenticated) {
      this._router.navigate(id ? [path, id] : [path]);
    } else {
      this._router.navigate(['/login']);
    }
  }
}
