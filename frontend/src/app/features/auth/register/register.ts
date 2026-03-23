import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  userData = { name: '', email: '', password: '', role: 'user' };
  error: string | null = null;
  loading = false;

  isDropdownOpen = false;
  roles = [
    { value: 'user', label: 'Looking to Buy/Rent' },
    { value: 'agent', label: 'Real Estate Agent' },
    { value: 'admin', label: 'Administrator' }
  ];

  constructor(
    private authService: AuthService, 
    private router: Router,
    private eRef: ElementRef
  ) {}

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
    return this.roles.find(r => r.value === this.userData.role)?.label || 'Select Role';
  }

  onSubmit() {
    this.loading = true;
    this.error = null;
    this.authService.register(this.userData).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
