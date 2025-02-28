import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    TaskComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Controls whether tasks sidebar is open on mobile
  isTasksOpen = false;

  toggleTasksSidebar() {
    this.isTasksOpen = !this.isTasksOpen;
  }
}
