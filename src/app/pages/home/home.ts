import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceApi } from '../../core/services/service-api';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [FormsModule, HttpClientModule , CommonModule ,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{

services: any[] = [];
  displayedServices: any[] = [];
  searchTerm: string = '';

  constructor(private api: ServiceApi) {}

  ngOnInit() {
    this.api.getServices().subscribe((data: any[])=> {
      this.services = data;
      this.displayedServices = data;
      console.log(data)
    });
  }

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.displayedServices = this.services;
      return;
    }

    this.displayedServices = this.services.filter(s =>
      s.name.toLowerCase().includes(term.toLowerCase())
    );
  }

}
