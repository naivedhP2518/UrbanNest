import { Component, AfterViewInit, NgZone, HostListener, ElementRef } from '@angular/core';
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
  error: string | null = null;
  loading = false;

  isDropdownOpen = false;
  roles = [
    { value: 'user', label: 'Looking to Buy/Rent' },
    { value: 'agent', label: 'Real Estate Agent' },
    { value: 'admin', label: 'Administrator' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private eRef: ElementRef,
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
          client_id: 'YOUR_GOOGLE_CLIENT_ID',
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
        next: () => this.router.navigate(['/']),
        error: (err) => {
          this.error =
            err.error?.message || 'Google sign-up failed. Please try again.';
          this.loading = false;
        },
      });
    });
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectRole(role: string) {
    this.userData.role = role;
    this.isDropdownOpen = false;
  }

  getSelectedRoleLabel() {
    return (
      this.roles.find((r) => r.value === this.userData.role)?.label ||
      'Select Role'
    );
  }

  onSubmit() {
    this.loading = true;
    this.error = null;
    this.authService.register(this.userData).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error =
          err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      },
    });
  }
}
