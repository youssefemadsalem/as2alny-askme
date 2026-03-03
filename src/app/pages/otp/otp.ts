import { Component, ElementRef, inject, signal, viewChildren } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './otp.html',
  styleUrl: './otp.css',
})
export class Otp {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private _Auth = inject(Auth);

  alreadyexist = signal(false);
  isLoading = signal(false);

  inputs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');

  otpForm: FormGroup = this.fb.group({
    otp: this.fb.array(
      Array(6)
        .fill('')
        .map(() => this.fb.control('', [Validators.required])),
    ),
  });

  get otpControls() {
    return (this.otpForm.get('otp') as FormArray).controls;
  }

  onSubmit(): void {
    if (this.otpForm.invalid) return;

    this.isLoading.set(true);
    this.alreadyexist.set(false);

    const otpValue = this.otpForm.value.otp.join('');

    const payload = { otp: otpValue };

    this._Auth.validateotp(payload).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        console.log('Server Response:', res);
        this._Auth.otpCode = this.otpForm.value.otp.join('');

        const token = res.token || res.accessToken || res.data?.accessToken || res.data?.token;

        if (token) {
          localStorage.setItem('userToken', token);
        }

        this.router.navigate(['/resetpassword']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading.set(false);
        this.alreadyexist.set(err.error?.message || 'Invalid code. Please try again.');
      },
    });
  }

  handleInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (!/^\d+$/.test(value)) {
      input.value = value.replace(/\D/g, '');
      this.otpControls[index].setValue(input.value);
      return;
    }

    if (input.value && index < 5) {
      const nextInput = this.inputs()[index + 1]?.nativeElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  handleKeyDown(index: number, event: KeyboardEvent): void {
    const key = event.key;

    if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'].includes(key)) {
      if (key === 'Backspace') {
        const currentVal = this.otpControls[index].value;
        if (!currentVal && index > 0) {
          const prevInput = this.inputs()[index - 1]?.nativeElement;
          if (prevInput) {
            prevInput.focus();
          }
        }
      }
      return;
    }

    if (event.metaKey || event.ctrlKey) {
      return;
    }

    if (!/^[0-9]$/.test(key)) {
      event.preventDefault();
    }
  }

  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedText) {
      pastedText.split('').forEach((char, i) => {
        if (i < 6) {
          this.otpControls[i].setValue(char);
        }
      });

      const nextIndex = Math.min(pastedText.length, 5);
      const targetInput = this.inputs()[nextIndex]?.nativeElement;
      if (targetInput) {
        targetInput.focus();
      }
    }
  }
}
