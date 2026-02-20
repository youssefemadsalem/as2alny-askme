import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-resetpassword',
  imports: [ReactiveFormsModule],
  templateUrl: './resetpassword.html',
  styleUrl: './resetpassword.css',
})
export class Resetpassword {
  private _Auth = inject(Auth);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  isLoading = signal(false);
  alreadyexist: string = '';

  resetForm = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.pattern(/^\w{6,}$/)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.compare },
  );

  resetSubmit() {
    if (this.resetForm.invalid) return;
    this.isLoading.set(true);
    this.alreadyexist = '';

    const apiData = {
      newPassword: this.resetForm.value.newPassword,
      confirmPassword: this.resetForm.value.confirmPassword,
      otp: this._Auth.otpCode,
    };

    console.log('Sending API Data:', apiData);

    this._Auth.Resetpassword(apiData).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        console.log('Success', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log('Error', err);
        this.alreadyexist = err.error?.message || 'An error occurred';
        this.isLoading.set(false);
      },
    });
  }

  compare(group: AbstractControl) {
    const password = group.get('newPassword')?.value;
    const confirmControl = group.get('confirmPassword');

    if (!confirmControl?.value) return null;

    if (password !== confirmControl?.value) {
      confirmControl.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      if (confirmControl.hasError('mismatch')) {
        confirmControl.setErrors(null);
      }
      return null;
    }
  }
}
