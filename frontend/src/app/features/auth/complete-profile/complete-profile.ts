import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './complete-profile.html',
  styleUrl: './complete-profile.css',
})
export class CompleteProfileComponent {
  selectedRole = 'user';
  bio = '';
  experience = 0;
  phone = '';
  error: string | null = null;
  success: string | null = null;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  selectRole(role: string) {
    this.selectedRole = role;
  }

  onSubmit() {
    this.loading = true;
    this.error = null;

    const updateData: any = {
      role: this.selectedRole,
      profileCompleted: true
    };

    if (this.phone) updateData.phone = this.phone;

    if (this.selectedRole === 'agent') {
      updateData.bio = this.bio;
      updateData.experience = this.experience;
    }

    this.authService.updateProfile(updateData).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.success = 'Profile completed!';
          setTimeout(() => this.router.navigate(['/']), 1000);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to update profile.';
      },
    });
  }
}
