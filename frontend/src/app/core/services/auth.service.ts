import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  experience?: number;
  happyClients?: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  currentUser = signal<User | null>(this.getUserFromStorage());

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(tap((res) => this.setSession(res)));
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap((res) => this.setSession(res)));
  }

  googleLogin(credential: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/google`, { credential })
      .pipe(tap((res) => this.setSession(res)));
  }

  getMe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  getProfile(): Observable<{ success: boolean; data: User }> {
    return this.http.get<{ success: boolean; data: User }>('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  updateProfile(profileData: any): Observable<{ success: boolean; user: User }> {
    return this.http.put<{ success: boolean; user: User }>('http://localhost:5000/api/users/profile', profileData, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    }).pipe(
      tap((res) => {
        if (res.success && res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.currentUser.set(res.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    this.currentUser.set(authResult.user);
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  getAvatarUrl(avatar?: string): string {
    // Force the uniform default image as requested by the user
    return 'http://localhost:5000/images/default-agent.png';
  }
}
