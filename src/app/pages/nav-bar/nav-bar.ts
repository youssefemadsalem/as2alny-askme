import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';
import { UserDataService } from '../../core/services/user-api/user-data';
import { UserImageService } from '../../core/services/user-api/user-image-preview';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  constructor(private _userImageService: UserImageService) {}
  readonly _auth = inject(Auth);


  _userDataService = inject(UserDataService);

  imageUrl = signal<string | null>(null);

  isLogin: boolean = false;

  ngOnInit(): void {
    // load user image on init
    this._userDataService.getUserData().subscribe({
      next: (res) => {
        this.imageUrl.set(res.data.profileImage?.url || null);
      },
    });

    // update user Image when changing it from profile
    this._userImageService.image$.subscribe((url) => {
      this.imageUrl.set(url);;
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


}
