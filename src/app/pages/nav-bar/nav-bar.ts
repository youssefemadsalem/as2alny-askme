import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  private readonly _router = inject(Router);
  private readonly _auth = inject(Auth);

  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
    this._auth.x = null;
  }
}
