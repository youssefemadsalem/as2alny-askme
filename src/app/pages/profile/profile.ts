import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth/auth';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './profile.html',
})
export class ProfileComponent implements OnInit {
  readonly _auth = inject(Auth);
  router = inject(Router);
  private toast = inject(HotToastService);

  ngOnInit() {}

  logout() {
    this.toast.success('تم الخروج بنجاح');

    this._auth.logOut();
  }
}
