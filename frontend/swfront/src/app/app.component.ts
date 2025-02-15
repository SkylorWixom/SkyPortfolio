import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  // We list our imports here for standalone components:
  imports: [
    RouterOutlet, // Needed to display routed components in <router-outlet>
    RouterLink    // Needed so that <a routerLink="..."> works
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'swfront';
}
