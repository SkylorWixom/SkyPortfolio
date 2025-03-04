import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/admin/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
