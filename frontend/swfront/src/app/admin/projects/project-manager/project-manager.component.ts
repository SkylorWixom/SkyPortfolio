import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectsService, Project } from '../../../services/projects/projects.service';

@Component({
  selector: 'app-project-manager',
  templateUrl: './project-manager.component.html',
  styleUrls: ['./project-manager.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProjectManagerComponent implements OnInit {
  projects: Project[] = [];
  newProject: Project = this.getEmptyProject();
  editMode = false;
  successMessage = '';
  errorMessage = '';
  showPreview = false;
  stackInput = '';
  categories = ['web', 'mobile', 'backend', 'design', 'other'];
  
  constructor(private projectService: ProjectsService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  // Load all existing projects
  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => {
        this.errorMessage = `Failed to load projects: ${error.message}`;
      }
    });
  }

  // Create or update a project
  saveProject(): void {
    if (this.editMode) {
      // Updating existing project
      this.projectService.updateProject(this.newProject._id!, this.newProject).subscribe({
        next: () => {
          this.successMessage = 'Project updated successfully!';
          this.errorMessage = '';
          this.resetForm();
          this.loadProjects();
        },
        error: (error) => {
          this.errorMessage = `Failed to update project: ${error.message}`;
          this.successMessage = '';
        }
      });
    } else {
      // Creating new project
      this.projectService.createProject(this.newProject).subscribe({
        next: () => {
          this.successMessage = 'Project created successfully!';
          this.errorMessage = '';
          this.resetForm();
          this.loadProjects();
        },
        error: (error) => {
          this.errorMessage = `Failed to create project: ${error.message}`;
          this.successMessage = '';
        }
      });
    }
  }

  // Edit an existing project
  editProject(project: Project): void {
    this.newProject = { ...project };
    this.editMode = true;
    this.showPreview = false;
  }

  // Delete an existing project by ID
  deleteProject(id: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.successMessage = 'Project deleted successfully!';
          this.errorMessage = '';
          this.loadProjects();
        },
        error: (error) => {
          this.errorMessage = `Failed to delete project: ${error.message}`;
          this.successMessage = '';
        }
      });
    }
  }

  // Toggle "featured" boolean
  toggleFeatured(project: Project): void {
    const updatedProject = { ...project, featured: !project.featured };
    this.projectService.updateProject(project._id!, updatedProject).subscribe({
      next: () => {
        this.successMessage = `Project ${updatedProject.featured ? 'featured' : 'unfeatured'} successfully!`;
        this.errorMessage = '';
        this.loadProjects();
      },
      error: (error) => {
        this.errorMessage = `Failed to update project status: ${error.message}`;
        this.successMessage = '';
      }
    });
  }

  // Cancel edit mode and reset form
  cancelEdit(): void {
    this.resetForm();
  }

  // Toggle preview mode
  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  // Add an item to the "stack"
  addStackItem(): void {
    const trimmed = this.stackInput.trim();
    if (trimmed) {
      if (!this.newProject.stack) {
        this.newProject.stack = [];
      }
      if (!this.newProject.stack.includes(trimmed)) {
        this.newProject.stack.push(trimmed);
      }
      this.stackInput = '';
    }
  }

  // Remove an item from the "stack"
  removeStackItem(item: string): void {
    this.newProject.stack = this.newProject.stack.filter(tech => tech !== item);
  }

  // Reset the form
  private resetForm(): void {
    this.newProject = this.getEmptyProject();
    this.editMode = false;
    this.showPreview = false;
    this.stackInput = '';
  }

  // Provide default initial values
  private getEmptyProject(): Project {
    return {
      title: '',
      description: '',
      stack: [],
      category: 'web',
      date: new Date().toISOString().split('T')[0],
      featured: false
    };
  }
}
