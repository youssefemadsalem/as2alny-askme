import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private _Auth: Auth) {}
  private readonly _Router = inject(Router);
  alreadyexist!: string;
  isLoading = signal(false);
  isavail = signal(false);

  loginform: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),
  });

  login() {
    this.alreadyexist = '';
    if (this.loginform.invalid) {
      this.loginform.markAllAsTouched();
      return;
    }
    this.isavail.set(true);
    this.isLoading.set(true);

    this._Auth.sighin(this.loginform.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);

        if (res.data && res.data.accessToken) {
          this._Auth.saveToken(res.data.accessToken, res.data.refreshToken, res.data.user.name);

          this._Router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.log(err);
        this.alreadyexist = err.error?.message || 'An error occurred';
        this.isLoading.set(false);
      },
    });
  }
}
