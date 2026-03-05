import { NavBar } from './../nav-bar/nav-bar';
import { Component, ElementRef, inject, OnInit, signal, TemplateRef } from '@angular/core';
import { UserDataInterface } from '../../core/interfaces/user-data';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../core/services/user-api/user-data';
import { CookieService } from 'ngx-cookie-service';
import { UserImageService } from '../../core/services/user-api/user-image-preview';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-user-details-component',
  standalone: true,
  providers: [NavBar],
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-details-component.html',
  styleUrl: './user-details-component.css',
})
export class UserDetailsComponent implements OnInit {
  constructor(
    private _cookieService: CookieService,
    private _userImageService: UserImageService,
  ) {
    this.userName = this._cookieService.get('userName');
  }
  ngOnInit(): void {
    this.isLoadingData.set(true);

    this._userDataService.getUserData().subscribe({
      next: (res) => {
        this.user.set(res.data);

        this.imagePreview = this.user().profileImage?.url || null;

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

  private _userDataService = inject(UserDataService);
  private toast = inject(HotToastService);

  isLoadingData = signal<boolean>(true);
  isSaving = signal<boolean>(false);
  user = signal<UserDataInterface>({
    name: '',
    email: '',
    phoneNumber: '',
  });

  isOpeningImage: boolean = false;
  isEditing: boolean = false;
  alreadyExist: string = '';
  userName: string = '';
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
  });

  selectedImage: File | null = null;
  imagePreview: string | null = null;
  showImageMenu: boolean = false;

  onFileSelected(e: Event) {
    const fileInput = e.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.selectedImage = file;

      this.imagePreview = URL.createObjectURL(file);
      console.log('New image selected:', this.imagePreview);
      this.showImageMenu = false;
    }
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

      this._userDataService
        .updateUserData(formData)
        .pipe(
          this.toast.observe({
            success: 'تم تحديث البيانات بنجاح',

            error: (err) => 'حاول مره اخره',
          }),
        )

        .subscribe({
          next: (res) => {
            console.log('Sent ', res);
            this.isSaving.set(false);

            this.user.set({
              ...this.user(),
              ...this.updateProfileForm.value,
              profileImage: res.data.profileImage,
            });
            this.imagePreview = res.data.profileImage?.url || null;
            if (this.imagePreview) {
              this._userImageService.setImage(this.imagePreview);
            }

            this.selectedImage = null;
            this.toggleFlagMode();
            this._cookieService.set('userName', this.updateProfileForm.get('name')?.value);
          },
          error: (err: any) => {
            console.error(err);
            this.alreadyExist = err.error?.message || 'Error: Account might already exist';
            this.isSaving.set(false);
          },
        });
    }
  }

  deleteImage(): void {
    this._userDataService.deleteUserImage().subscribe({
      next: (res) => {
        console.log(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.selectedImage = null;
    this.imagePreview = null;
    this.showImageMenu = false;
  }

  openImage(openingImage: HTMLElement) {
    console.log(this.imagePreview);
    console.log(openingImage);
  }

  cancelEdit() {
    this.toggleFlagMode();

    this.updateProfileForm.get('name')?.setValue(this.user().name);
    this.updateProfileForm.get('email')?.setValue(this.user().email);
    this.updateProfileForm.get('phoneNumber')?.setValue(this.user().phoneNumber);

    this.imagePreview = this.user().profileImage?.url || null;
    this.selectedImage = null;
  }

  toggleFlagMode() {
    this.isEditing = !this.isEditing;
  }
  toggleOpenningImage() {
    this.isOpeningImage = !this.isOpeningImage;

    if (this.isOpeningImage == true) {
      const nav = document.querySelector('.navbar') as HTMLElement;
      console.log(document.querySelector('.navbar'));
      nav.style.cssText = 'z-index: 10';
    } else {
      const nav = document.querySelector('.navbar') as HTMLElement;
      console.log(document.querySelector('.navbar'));
      nav.style.cssText = 'z-index: 100';
    }
  }
}
