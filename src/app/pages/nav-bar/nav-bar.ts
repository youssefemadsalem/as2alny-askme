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
  readonly _auth = inject(Auth);

  // Variable to track login status
  isLogin: boolean = false;

  ngOnInit(): void {
    // Subscribe to the Auth service to detect changes automatically
    this._auth.userData.subscribe({
      next: (res) => {
        // If 'res' has data, user is logged in. If null, they are out.
        this.isLogin = res !== null;
      },
    });
  }

  logout() {
    this._auth.logOut();
  }
}
