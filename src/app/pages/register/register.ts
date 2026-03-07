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
import { HotToastService } from '@ngxpert/hot-toast';

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
  private toast = inject(HotToastService);

  alreadyexist: string = '';
  isLoading = signal(false);
  isavail = signal(false);

  isPasswordVisible = signal(false);
  isConfirmPasswordVisible = signal(false);

  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^([\u0600-\u06FF]+\s){3}[\u0600-\u06FF]+.*$/),
      ]),
      nationalId: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{14}$/)]),
      phoneNumber: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
      ]),
      confirmPassword: new FormControl(null),
    },
    { validators: this.compare },
  );

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
    } else {
      this.alreadyexist = '';
      this.isLoading.set(true);

      this._Auth
        .sighup(this.registerForm.value)
        .pipe(
          this.toast.observe({
            success: 'تم انشاء الحساب بنجاح',
            error: (err) => 'حاول مره اخره',
          }),
        )
        .subscribe({
          next: (res) => {
            console.log(res);
            this.isLoading.set(false);
            this._Router.navigate(['/login']);
          },
          error: (err) => {
            console.log(err);
            this.alreadyexist = err.error?.message || 'Error: Account might already exist';
            this.isLoading.set(false);
            this.cdr.detectChanges();
          },
        });
    }
  }

  compare(fgroup: AbstractControl) {
    if (fgroup.get('password')?.value === fgroup.get('confirmPassword')?.value) {
      return null;
    } else {
      return { missmatch: true };
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible.update((v) => !v);
  }

  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible.update((v) => !v);
  }
}
