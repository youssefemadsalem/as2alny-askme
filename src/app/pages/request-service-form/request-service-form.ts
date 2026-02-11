import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-request-service-form',
  imports: [NgIf , ReactiveFormsModule ],
  templateUrl: './request-service-form.html',
  styleUrl: './request-service-form.css',
})
export class RequestServiceForm {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      nationalId: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      serviceName: ['', Validators.required],
      description: ['']
    });
  }

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
      alert('تم استلام طلبك بنجاح');
      this.form.reset();
    }
  }

}
