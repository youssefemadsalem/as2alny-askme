import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, QueryList, signal, viewChildren } from '@angular/core';
import { UserData } from '../../core/interfaces/user-data';
import { Auth } from '../../core/services/auth/auth';
import { AbstractControl,  FormControl,  FormGroup,  ReactiveFormsModule,  Validators,} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-details-component.html',
  styleUrl: './user-details-component.css',
})
export class UserDetailsComponent implements OnInit {
    ngOnInit(): void {}



  // Variables
    user: UserData = {
    name: 'يوسف محمد أحمد',
    email: 'yousef@example.com',
    nationalId: 1234567890,
    phoneNumber: '0123456789',
  };



  updateProfileForm: FormGroup = new FormGroup(
    {
      name: new FormControl(this.user.name, [
        Validators.required,
        Validators.pattern(/^([\u0600-\u06FF]+\s){3}[\u0600-\u06FF]+.*$/),
      ]),


      phoneNumber: new FormControl(this.user.phoneNumber, [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/),
      ]),
      nationalId: new FormControl(this.user.nationalId, [Validators.required, Validators.pattern(/^[0-9]{14}$/)]),

      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
    },
  );


  isEditing: boolean = false;
  constructor(private _Auth: Auth) {}
  private readonly cdr = inject(ChangeDetectorRef);
  alreadyexist: string = '';
  isLoading = signal(false);
  isavail = signal(false);


  

  register(): void {
   this.toggleFlagMode();
    if (this.updateProfileForm.invalid) {
      this.updateProfileForm.markAllAsTouched();
    } else {
      this.alreadyexist = '';
      this.isLoading.set(true);
      this._Auth.sighup(this.updateProfileForm.value).subscribe({
        next: (res:any) => {
          console.log(res);
          this.isLoading.set(false);
        },
        error: (err:any) => {
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

  cancelEdit(){
    this.toggleFlagMode();
    this.updateProfileForm.get('name')?.setValue(this.user.name);
    this.updateProfileForm.get('email')?.setValue(this.user.email);
    this.updateProfileForm.get('phoneNumber')?.setValue(this.user.phoneNumber);
  }

  toggleFlagMode(){
    this.isEditing = !this.isEditing;
  }

}
