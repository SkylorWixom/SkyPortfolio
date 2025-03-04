import { Component, OnInit } from '@angular/core';
import { TasksService, Task as ServiceTask } from '../../../services/task/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//local Task interface that matches component needs
interface Task {
  _id: string;
  title: string;
  details: string;
  status: 'completed' | 'active' | 'backlog' | 'pending';
  updatedAt?: Date;
}

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css'],
  standalone: true, 
  imports: [CommonModule, FormsModule] 
})
export class TaskManagerComponent implements OnInit {
  // Properties used in the template
  tasks: Task[] = [];
  newTask: Task = {
    _id: '',
    title: '',
    details: '',
    status: 'pending'
  };
  
  editMode = false;
  successMessage = '';
  errorMessage = '';

  constructor(private taskService: TasksService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks.map(task => ({
          _id: task._id || '',
          title: task.title,
          details: task.details || '', // Provide default for undefined
          status: task.status as 'completed' | 'active' | 'backlog' | 'pending',
          updatedAt: task.updatedAt
        }));
      },
      error: (error) => {
        this.errorMessage = 'Failed to load tasks: ' + error.message;
      }
    });
  }

  saveTask(): void {
    if (this.editMode) {
      // Convert task to the format expected by the service
      const taskToUpdate: Partial<ServiceTask> = {
        title: this.newTask.title,
        details: this.newTask.details,
        // Map 'pending' to a valid status if needed
        status: this.newTask.status === 'pending' ? 'active' : this.newTask.status
      };

      this.taskService.updateTask(this.newTask._id, taskToUpdate).subscribe({
        next: () => {
          this.successMessage = 'Task updated successfully!';
          this.errorMessage = '';
          this.resetForm();
          this.loadTasks();
        },
        error: (error) => {
          this.errorMessage = 'Failed to update task: ' + error.message;
          this.successMessage = '';
        }
      });
    } else {
      // Convert task to the format expected by the service
      const taskToCreate: Partial<ServiceTask> = {
        title: this.newTask.title,
        details: this.newTask.details,
        // Map 'pending' to a valid status if needed
        status: this.newTask.status === 'pending' ? 'active' : this.newTask.status
      };

      this.taskService.createTask(taskToCreate).subscribe({
        next: () => {
          this.successMessage = 'Task created successfully!';
          this.errorMessage = '';
          this.resetForm();
          this.loadTasks();
        },
        error: (error) => {
          this.errorMessage = 'Failed to create task: ' + error.message;
          this.successMessage = '';
        }
      });
    }
  }

  editTask(task: Task): void {
    // Clone the task to avoid direct modification
    this.newTask = { ...task };
    this.editMode = true;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.successMessage = 'Task deleted successfully!';
          this.errorMessage = '';
          this.loadTasks();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete task: ' + error.message;
          this.successMessage = '';
        }
      });
    }
  }

  private resetForm(): void {
    this.newTask = {
      _id: '',
      title: '',
      details: '',
      status: 'pending'
    };
    this.editMode = false;
  }
}
