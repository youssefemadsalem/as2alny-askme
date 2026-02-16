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
import { Auth } from '../../core/services/auth/auth'; // Ensure this path is correct

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
  private _Auth = inject(Auth); // Injected via inject() for consistency

  alreadyexist = signal(false); // Changed to signal for better reactivity
  isLoading = signal(false);

  // Queries all elements with #otpInput
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
    this.alreadyexist.set(false); // Clear previous errors

    // Join array to string "123456"
    const otpValue = this.otpForm.value.otp.join('');

    // Check if your backend expects { "otp": "..." } or { "code": "..." }
    const payload = { otp: otpValue };

    this._Auth.validateotp(payload).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        console.log('Server Response:', res); // Debugging
        this._Auth.otpCode = this.otpForm.value.otp.join(''); // Save OTP in service for later use
        // 1. Save Token (Handle various response structures)
        const token = res.token || res.accessToken || res.data?.accessToken || res.data?.token;

        if (token) {
          localStorage.setItem('userToken', token);
        }

        // 2. Navigate
        // We navigate because we reached 'next' (Success), regardless of specific token structure
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

    // Ensure only numbers
    if (!/^\d+$/.test(value)) {
      input.value = value.replace(/\D/g, ''); // Update UI immediately
      this.otpControls[index].setValue(input.value);
      return;
    }

    // Move to next input if value exists and we aren't at the end
    if (input.value && index < 5) {
      const nextInput = this.inputs()[index + 1]?.nativeElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  handleKeyDown(index: number, event: KeyboardEvent): void {
    const key = event.key;

    // Allow navigation and deletion keys
    if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'].includes(key)) {
      // Special Logic for Backspace: Move back if current is empty
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
