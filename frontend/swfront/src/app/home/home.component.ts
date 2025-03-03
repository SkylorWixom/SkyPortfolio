import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TasksService, Task } from '../services/task/task.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Controls whether tasks sidebar is open on mobile
  isTasksOpen = false;
  
  // Task-related properties (moved from TaskComponent)
  allTasks: Task[] = [];
  lastUpdate: Date | null = null;

  constructor(private tasksService: TasksService) {}

  toggleTasksSidebar() {
    this.isTasksOpen = !this.isTasksOpen;
  }

  ngOnInit(): void {
    this.tasksService.getAllTasks().subscribe({
      next: (data) => {
        this.allTasks = data;
        this.calculateLastUpdate();
      },
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  // Helper to find the maximum updatedAt (moved from TaskComponent)
  calculateLastUpdate(): void {
    if (!this.allTasks.length) {
      this.lastUpdate = null;
      return;
    }
    let maxDate = new Date(this.allTasks[0].updatedAt!);
    this.allTasks.forEach((task) => {
      const taskDate = new Date(task.updatedAt!);
      if (taskDate > maxDate) {
        maxDate = taskDate;
      }
    });
    this.lastUpdate = maxDate;
  }
}
