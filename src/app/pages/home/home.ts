import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';
@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  services: any[] = [];
  displayedServices: any[] = [];
  searchTerm: string = '';

  readonly _auth = inject(Auth);
  readonly _router = inject(Router);

  // ngOnInit() {
  //   this.api.getServices().subscribe((data: any[]) => {
  //     this.services = data;
  //     this.displayedServices = data;
  //     console.log(data);
  //   });
  // }

  // onSearch() {
  //   const term = this.searchTerm.trim().toLowerCase();

  //   if (!term) {
  //     this.displayedServices = this.services;
  //     return;
  //   }

  //   this.displayedServices = this.services.filter((s) =>
  //     s.name.toLowerCase().includes(term.toLowerCase()),
  //   );
  // }

  // handleProtectedNavigate(path: string, id: any) {
  //   if (this._auth.userData.getValue() !== null) {
  //     this._router.navigate([path, id]);
  //   } else {
  //     this._router.navigate(['/login']);
  //   }
  // }
}
