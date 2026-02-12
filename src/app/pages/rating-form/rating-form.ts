import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ServiceApi } from '../../core/services/service-api';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

interface Rating {
  service: string;
  stars: number;
  comment: string;
}
@Component({
  selector: 'app-rating-form',
  imports: [NgFor , CommonModule , HttpClientModule , FormsModule , BrowserModule],
  templateUrl: './rating-form.html',
  styleUrl: './rating-form.css',
})
export class RatingForm  implements OnInit{

  services: string[] = []; // هتملى من API
  stars = [1, 2, 3, 4, 5];

  selectedService = '';
  rating = 0;
  comment = '';

  ratings: Rating[] = [];

  constructor(private api: ServiceApi) {}

  ngOnInit() {
    this.api.getServices().subscribe((data) => {
      // لو كل service فيها اسم
      this.services = data.map(s => s.name);
    });
  }

  setRating(value: number) {
    this.rating = value;
  }

  submitRating() {
    if (!this.selectedService || !this.rating || !this.comment.trim()) {
      alert('من فضلك اكمل جميع البيانات');
      return;
    }

    this.ratings.unshift({
      service: this.selectedService,
      stars: this.rating,
      comment: this.comment
    });

    this.selectedService = '';
    this.rating = 0;
    this.comment = '';
  }
}
