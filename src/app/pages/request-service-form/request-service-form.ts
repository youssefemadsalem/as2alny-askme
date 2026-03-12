import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { UserRequests } from '../../core/services/user-api/user-requests';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-request-service-form',
  imports: [ReactiveFormsModule],
  templateUrl: './request-service-form.html',
  styleUrl: './request-service-form.css',
})
export class RequestServiceForm {
  form: FormGroup;
  private readonly _UserRequests = inject(UserRequests);
  isLoading = signal(false);
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toaster: HotToastService,
  ) {
    this.form = this.fb.group({
      serviceName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading.set(true);
      const payload = {
        serviceName: this.form.value.serviceName,
        serviceDescription: this.form.value.description,
      };

      this._UserRequests.createServiceRequest(payload).subscribe({
        next: (res) => {
          console.log('Request sent successfully', res);
          this.isLoading.set(false);
          this.form.reset();
          this.toaster.success('تم ارسال الطلب بنجاح');
        },
        error: (err) => {
          console.error('Error sending request', err);
          this.isLoading.set(false);
          this.toaster.error('حدث  خطأ في ارسال الطلب');
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
