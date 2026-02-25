import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  signal,
  viewChildren,
} from '@angular/core';
import { UserDataInterface } from '../../core/interfaces/user-data';
import { Auth } from '../../core/services/auth/auth';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../core/services/user-data';
import { disabled } from '@angular/forms/signals';

@Component({
  selector: 'app-user-details-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-details-component.html',
  styleUrl: './user-details-component.css',
})
export class UserDetailsComponent implements OnInit {
  _userDataService = inject(UserDataService);

  ngOnInit(): void {
    this._userDataService.getUserData().subscribe({
      next: (res) => {
        console.log(res.data);
        this.user = res.data;
        this.updateProfileForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          phoneNumber: this.user.phoneNumber,
          nationalId: this.user.nationalId,
        });
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Mission Done , Data Loaded');
      },
    });
  }

  // Variables
  user: UserDataInterface = {
    name: '',
    email: '',
    phoneNumber: '',
  };

  updateProfileForm: FormGroup = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^([\u0600-\u06FF]+\s){3}[\u0600-\u06FF]+.*$/),
    ]),

    phoneNumber: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/),
    ]),
    nationalId: new FormControl({value:this.user.nationalId , disabled:true } , [Validators.required, Validators.pattern(/^[0-9]{14}$/)]),

    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  isEditing: boolean = false;
  constructor(private _Auth: Auth) {}
  private readonly cdr = inject(ChangeDetectorRef);
  alreadyexist: string = '';
  isLoading = signal(false);
  isavail = signal(false);

  updateProfile(): void {
    if (this.updateProfileForm.invalid) {
      this.updateProfileForm.markAllAsTouched();
    } else {
      this.alreadyexist = '';
      this.isLoading.set(true);
      this._userDataService.updateUserData(this.updateProfileForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading.set(false);
          this.user = { ...this.user, ...this.updateProfileForm.value };
          this.toggleFlagMode();
          this.cdr.detectChanges();

        },
        error: (err: any) => {
          console.log(err);
          this.alreadyexist = err.error?.message || 'Error: Account might already exist';
          this.isLoading.set(false);
        },
      });
    }
  }

  cancelEdit() {
    this.toggleFlagMode();
    this.updateProfileForm.get('name')?.setValue(this.user.name);
    this.updateProfileForm.get('email')?.setValue(this.user.email);
    this.updateProfileForm.get('phoneNumber')?.setValue(this.user.phoneNumber);
  }

  toggleFlagMode() {
    this.isEditing = !this.isEditing;
  }
}
