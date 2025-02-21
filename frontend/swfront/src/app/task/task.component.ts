import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService, Task } from '../services/task/task.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TasksComponent implements OnInit {
  allTasks: Task[] = [];
  
  // (A) We’ll store the latest update date here
  lastUpdate: Date | null = null;

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasksService.getAllTasks().subscribe({
      next: (data) => {
        this.allTasks = data;
        // (B) After we load tasks, find the latest updatedAt
        this.calculateLastUpdate();
      },
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  // (C) Simple helper to find the maximum updatedAt
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

