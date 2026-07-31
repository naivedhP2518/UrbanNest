import { Component, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

declare const google: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent implements AfterViewInit {
  userData = { name: '', email: '', password: '', role: 'user' };
  confirmPassword = '';
  error: string | null = null;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    this.initializeGoogleSignIn();
  }

  private initializeGoogleSignIn() {
    const checkGoogle = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts) {
        clearInterval(checkGoogle);
        google.accounts.id.initialize({
          client_id: '1048335885083-oonol28cfa74bridh9n3c0f9fcq0obi3.apps.googleusercontent.com',
          callback: (response: any) => this.handleGoogleResponse(response),
        });
        google.accounts.id.renderButton(
          document.getElementById('google-signup-btn'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            shape: 'pill',
            text: 'signup_with',
            logo_alignment: 'center',
          }
        );
      }
    }, 100);

    setTimeout(() => clearInterval(checkGoogle), 5000);
  }

  private handleGoogleResponse(response: any) {
    this.ngZone.run(() => {
      this.loading = true;
      this.error = null;
      this.authService.googleLogin(response.credential).subscribe({
        next: (res) => {
          if (res.user && !res.user.profileCompleted) {
            this.router.navigate(['/complete-profile']);
          } else {
            this.redirectAfterAuth(res.user);
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'Google sign-up failed. Please try again.';
          this.loading = false;
        },
      });
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.userData.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.error = null;
    this.authService.register(this.userData).subscribe({
      next: (res) => {
        if (res.user && !res.user.profileCompleted) {
          this.router.navigate(['/complete-profile']);
        } else {
          this.redirectAfterAuth(res.user);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      },
    });
  }

  private redirectAfterAuth(user: any) {
    if (user?.role === 'agent') {
      this.router.navigate(['/agent/dashboard']);
    } else {
      this.router.navigate(['/properties']);
    }
  }
}
