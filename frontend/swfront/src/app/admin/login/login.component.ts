import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/admin/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  login(): void {
    if (!this.username || !this.password) {
      this.error = 'Please enter both username and password';
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.error = 'Invalid credentials';
        console.error('Login error:', err);
        this.loading = false;
      }
    });
  }
}
