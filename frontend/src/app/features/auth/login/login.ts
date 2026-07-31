import { Component, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements AfterViewInit {
  credentials = { email: '', password: '' };
  error: string | null = null;
  loading = false;
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    this.initializeGoogleSignIn();
  }

  private initializeGoogleSignIn() {
    // Wait for Google Identity Services to load
    const checkGoogle = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts) {
        clearInterval(checkGoogle);
        google.accounts.id.initialize({
          client_id: '1048335885083-oonol28cfa74bridh9n3c0f9fcq0obi3.apps.googleusercontent.com',
          callback: (response: any) => this.handleGoogleResponse(response),
        });
        google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            shape: 'pill',
            text: 'signin_with',
            logo_alignment: 'center',
          }
        );
      }
    }, 100);

    // Stop trying after 5 seconds
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
          this.error =
            err.error?.message || 'Google sign-in failed. Please try again.';
          this.loading = false;
        },
      });
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = null;
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        if (res.user && !res.user.profileCompleted) {
          this.router.navigate(['/complete-profile']);
        } else {
          this.redirectAfterAuth(res.user);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed. Please try again.';
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
