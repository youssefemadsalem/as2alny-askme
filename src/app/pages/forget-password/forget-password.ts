import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';
import {
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  imports: [RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {
  private readonly _Auth = inject(Auth);
  private readonly _Router = inject(Router);
  alreadyexist: string = '';
  isLoading = signal(false);
  isavail = signal(false);

  error: string = '';

  forgetform: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  forget() {
    this.error = '';
    if (this.forgetform.invalid) {
      this.forgetform.markAllAsTouched();
    } else {
      this.isLoading.set(true);
      this._Auth.forget(this.forgetform.value).subscribe({
        next: (res) => {
          this._Router.navigate(['submitconfirmationcode']);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error = err.error.message;
          this.isLoading.set(false);
        },
      });
    }
  }
}
