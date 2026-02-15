import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  constructor(private _Auth: Auth) {}
  private readonly _Router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  alreadyexist: string = '';
  isLoading = signal(false);
  isavail = signal(false);

  registerForm: FormGroup = new FormGroup(
    {
      // 1. Name: Quadruple Name (At least 4 words)
      name: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^([\u0600-\u06FF]+\s){3}[\u0600-\u06FF]+.*$/),
      ]),

      // 2. ID: Exactly 14 numbers
      nationalId: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{14}$/)]),

      // 3. Phone: Egyptian Format (Starts with 010, 011, 012, or 015 + 8 digits)
      phoneNumber: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/),
      ]),

      // 4. Email
      email: new FormControl(null, [Validators.required, Validators.email]),

      // 5. Password
      password: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),

      // 6. RePassword
      confirmPassword: new FormControl(null),
    },
    this.compare,
  );

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
    } else {
      // 1. Reset error and start loading
      this.alreadyexist = '';
      this.isLoading.set(true); // You forgot to set this to true!

      this._Auth.sighup(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading.set(false);
          this._Router.navigate(['/login']);
        },
        error: (err) => {
          console.log(err);

          // 2. Assign the value FIRST
          // We use optional chaining (?.) just in case err.error is null
          this.alreadyexist = err.error?.message || 'Error: Account might already exist';

          // 3. Stop loading
          this.isLoading.set(false);

          // 4. Trigger change detection LAST (after data is updated)
          this.cdr.detectChanges();
        },
      });
    }
  }

  compare(fgroup: AbstractControl) {
    if (fgroup.get('password')?.value === fgroup.get('confirmPassword')?.value) {
      return null; // no error
    } else {
      return { missmatch: true };
    }
  }
}
