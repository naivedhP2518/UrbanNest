import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  error: string | null = null;
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = null;
    this.authService.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error = err.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
