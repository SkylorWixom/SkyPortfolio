import { Component, OnInit } from '@angular/core';
import { ProjectsService, Project } from '../services/projects/projects.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  // We'll store the loaded projects here
  projects: Project[] = [];

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectsService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        console.log('Projects loaded:', this.projects);
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      }
    });
  }
}
