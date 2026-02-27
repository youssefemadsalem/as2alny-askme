import { NavBar } from './../nav-bar/nav-bar';
import { Component, inject, OnInit, signal } from '@angular/core';
import { UserDataInterface } from '../../core/interfaces/user-data';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../core/services/user-api/user-data';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-user-details-component',
  standalone: true,
  providers:[NavBar],
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-details-component.html',
  styleUrl: './user-details-component.css',
})
export class UserDetailsComponent implements OnInit {
  private _userDataService = inject(UserDataService);

  constructor(private _cookieService: CookieService , private nav : NavBar) {
    this.userNameHome = this._cookieService.get('userNameHome');
  }

  // Signals
  isLoadingData = signal<boolean>(true);
  isSaving = signal<boolean>(false);
  user = signal<UserDataInterface>({
    name: '',
    email: '',
    phoneNumber: '',
  });

  // Variables
  isEditing: boolean = false;
  alreadyExist: string = '';
  userNameHome!: string;

  // File upload variables
  selectedImage: File | null = null;
  imagePreview: string | null = null; // Holds the preview URL/Base64
  showImageMenu: boolean = false;


  updateProfileForm: FormGroup = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^([\u0600-\u06FF]+\s){3}[\u0600-\u06FF]+.*$/),
    ]),
    phoneNumber: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/),
    ]),
    nationalId: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.pattern(/^[0-9]{14}$/),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    // Note: profileImage is removed from here because file inputs cannot be bound to form controls securely.
  });

  ngOnInit(): void {
    this.isLoadingData.set(true);

    this._userDataService.getUserData().subscribe({
      next: (res) => {
        this.user.set(res.data);

        // Set initial image preview
        this.imagePreview = this.user().profileImage?.url || null;

        // Patch form (text fields only)
        this.updateProfileForm.patchValue({
          name: this.user().name,
          email: this.user().email,
          phoneNumber: this.user().phoneNumber,
          nationalId: this.user().nationalId,
        });

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
      this.alreadyExist = '';
      this.isSaving.set(true);

      const formData = new FormData();
      formData.append('name', this.updateProfileForm.get('name')?.value);
      formData.append('email', this.updateProfileForm.get('email')?.value);
      formData.append('phoneNumber', this.updateProfileForm.get('phoneNumber')?.value);

      if (this.selectedImage) {
        formData.append('profileImage', this.selectedImage);
      }

      this._userDataService.updateUserData(formData).subscribe({
        next: (res) => {
          console.log('Sent ', res);
          this.isSaving.set(false);

          // Update local user object and image preview so UI reflects changes immediately
          this.user.set({
            ...this.user(),
            ...this.updateProfileForm.value,
            profileImage: res.data.profileImage,
          });
          this.imagePreview = res.data.profileImage?.url || null;

          this.selectedImage = null; // Clear the selected file after successful upload
          this.toggleFlagMode();
          this._cookieService.set('userNameHome', this.updateProfileForm.get('name')?.value);
        },
        error: (err: any) => {
          console.error(err);
          this.alreadyExist = err.error?.message || 'Error: Account might already exist';
          this.isSaving.set(false);
        },
      });
    }
  }
  
  

  onFileSelected(e: Event) {
    const fileInput = e.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.selectedImage = file;

      this.imagePreview = URL.createObjectURL(file);

      // console.log('New image selected:', this.imagePreview);
      this.showImageMenu = false;
      this.nav.notifyDataUpdated(this.imagePreview);
    }
  }



  // ...existing methods...

  deleteImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
    this.showImageMenu = false;
  }

  cancelEdit() {
    this.toggleFlagMode();
    // Reset form to original values
    this.updateProfileForm.get('name')?.setValue(this.user().name);
    this.updateProfileForm.get('email')?.setValue(this.user().email);
    this.updateProfileForm.get('phoneNumber')?.setValue(this.user().phoneNumber);

    // Reset image preview to the original URL and clear selected file
    this.imagePreview = this.user().profileImage?.url || null;
    this.selectedImage = null;
  }

  toggleFlagMode() {
    this.isEditing = !this.isEditing;
  }
}
