import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';
import { UserDataService } from '../../core/services/user-api/user-data';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  readonly _auth = inject(Auth);
  @ViewChild('imageIcon') imageIcon! : ElementRef<HTMLImageElement>;
  // imageIcon : ElementRef<HTMLImageElement> = 

  _userDataService = inject(UserDataService);

  userImage = signal<string | null>(null);

  isLogin: boolean = false;

  ngOnInit(): void {
    // load user image
    this._userDataService.getUserData().subscribe({
      next: (res) => {
        this.userImage.set(res.data.profileImage?.url || null);
      },
    });

    this._auth.userData.subscribe({
      next: (res) => {
        this.isLogin = res !== null;
      },
    });
  }

  logout() {
    this._auth.logOut();
  }

  notifyDataUpdated(data: string): void {
    this.userImage.set(data);
    this.imageIcon.nativeElement.src = data;
  }
}
