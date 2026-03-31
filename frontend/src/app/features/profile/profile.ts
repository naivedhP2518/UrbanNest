import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    public authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      bio: [''],
      experience: [0, [Validators.min(0)]],
      happyClients: [0, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        password: '',
        bio: user.bio || '',
        experience: user.experience || 0,
        happyClients: user.happyClients || 0
      });
    }

    this.authService.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.profileForm.patchValue({
            name: res.data.name,
            email: res.data.email,
            bio: res.data.bio || '',
            experience: res.data.experience || 0,
            happyClients: res.data.happyClients || 0
          });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = this.profileForm.value;
    const updateData: any = {
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      experience: formData.experience,
      happyClients: formData.happyClients
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    this.authService.updateProfile(updateData).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.successMessage = 'Profile updated successfully!';
          this.profileForm.get('password')?.setValue('');
          
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to update profile. Details check console.';
        console.error(err);
      }
    });
  }
}
