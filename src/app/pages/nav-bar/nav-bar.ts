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

  isLogin: boolean = false;

  ngOnInit(): void {
    this._auth.userData.subscribe({
      next: (res) => {
        this.isLogin = res !== null;
      },
    });
  }

  logout() {
    this._auth.logOut();
  }
}
