import { Component, inject, OnInit, signal } from '@angular/core';
import { UserDataInterface } from '../../core/interfaces/user-data';
import { Auth } from '../../core/services/auth/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../core/services/user-api/user-data';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-user-details-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-details-component.html',
  styleUrl: './user-details-component.css',
})
export class UserDetailsComponent implements OnInit {
  private _userDataService = inject(UserDataService);


  constructor(private _cookieService: CookieService,){
    this.userName = this._cookieService.get('userName')
  }

  // Signals
  isLoadingData = signal<boolean>(true); // Loading state for initial data fetch
  isSaving = signal<boolean>(false); // Loading state for update button

  // Variables
  isEditing: boolean = false;
  alreadyexist: string = '';
  userName!:string ;

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
    nationalId: new FormControl(
      { value: '', disabled: true }, // Initial value empty
      [Validators.required, Validators.pattern(/^[0-9]{14}$/)],
    ),
    email: new FormControl(null, [Validators.required, Validators.email]),
    profilePicture: new FormControl(null)
  });

  ngOnInit(): void {
    // Start loading
    this.isLoadingData.set(true);

    this._userDataService.getUserData().subscribe({
      next: (res) => {
        this.user = res.data;

        // Patch form
        this.updateProfileForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          phoneNumber: this.user.phoneNumber,
          nationalId: this.user.nationalId,
          profilePicture: this.user.profilePicture ,
        });

        // Stop loading
        this.isLoadingData.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoadingData.set(false);
      },
    });
  }

  updateProfile(): void {
    if (this.updateProfileForm.invalid) {
      this.updateProfileForm.markAllAsTouched();
    } else {
      this.alreadyexist = '';
      this.isSaving.set(true); // Start saving spinner

      this._userDataService.updateUserData(this.updateProfileForm.value).subscribe({
        next: (res) => {
          this.isSaving.set(false);
          // Update local user object so UI reflects changes immediately
          this.user = { ...this.user, ...this.updateProfileForm.value };
          this.toggleFlagMode();
          this._cookieService.set('userName' , this.updateProfileForm.get('name')?.value)
        },
        error: (err: any) => {
          console.error(err);
          this.alreadyexist = err.error?.message || 'Error: Account might already exist';
          this.isSaving.set(false);
        },
      });
    }
  }

  cancelEdit() {
    this.toggleFlagMode();
    // Reset form to original values
    this.updateProfileForm.get('name')?.setValue(this.user.name);
    this.updateProfileForm.get('email')?.setValue(this.user.email);
    this.updateProfileForm.get('phoneNumber')?.setValue(this.user.phoneNumber);
    this.updateProfileForm.get('profilePicture')?.setValue(this.user.profilePicture);
  }

  toggleFlagMode() {
    this.isEditing = !this.isEditing;
  }
}
