import { UserRequests } from './../../core/services/user-requests';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from '../../core/interfaces/user-data';
import { Auth } from '../../core/services/auth/auth';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router'; 


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './profile.html',
})
export class ProfileComponent implements OnInit {

  // Injections 
  readonly _auth = inject(Auth);
  router = inject(Router);


  // Variables
  user: UserData = {
    name: 'يوسف محمد أحمد',
    email: 'yousef@example.com',
    nationalId: 1234567890,
    phoneNumber: '0123456789',
  };

  //Class functions
  ngOnInit() {

  }


  // user Functions

  // function that edit t




  logout() {
    this._auth.logOut();
  }
}

