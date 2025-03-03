import { Component, OnInit } from '@angular/core';
import { ProjectsService, Project } from '../services/projects/projects.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  // All projects loaded from service
  projects: Project[] = [];
  
  // Filtered projects to display
  filteredProjects: Project[] = [];
  
  // Currently selected project (for details panel)
  selectedProject: Project | null = null;
  
  // Filter states
  selectedCategory: string = 'all';
  selectedTech: string | null = null;
  
  // Available technologies list (built from project data)
  availableTech: string[] = [];

  // Add this property to your ProjectsComponent class
  isNavOpen = true;

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectsService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.filteredProjects = [...data];
        this.extractAvailableTechnologies();
        
        // Select the first project by default
        if (this.filteredProjects.length > 0) {
          this.selectedProject = this.filteredProjects[0];
        }
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      }
    });
  }

  // Extract unique technologies from all projects
  extractAvailableTechnologies(): void {
    const techSet = new Set<string>();
    this.projects.forEach(project => {
      project.stack.forEach(tech => techSet.add(tech));
    });
    this.availableTech = Array.from(techSet).sort();
  }

  // Filter projects by category
  filterProjects(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  // Filter projects by technology
  filterByTech(tech: string): void {
    this.selectedTech = this.selectedTech === tech ? null : tech;
    this.applyFilters();
  }

  // Apply both category and tech filters
  applyFilters(): void {
    // Start with all projects
    let result = [...this.projects];
    
    // Apply category filter if not 'all'
    if (this.selectedCategory !== 'all') {
      result = result.filter(project => project.category === this.selectedCategory);
    }
    
    // Apply tech filter if selected
    if (this.selectedTech) {
      result = result.filter(project => project.stack.includes(this.selectedTech!));
    }
    
    this.filteredProjects = result;
    
    // Update selected project
    if (this.filteredProjects.length > 0) {
      // If current selection is not in filtered results anymore, select the first one
      if (!this.filteredProjects.includes(this.selectedProject!)) {
        this.selectedProject = this.filteredProjects[0];
      }
    } else {
      this.selectedProject = null;
    }
  }

  // Select a project
  selectProject(project: Project): void {
    this.selectedProject = project;
  }

  // Add this method to your ProjectsComponent class
  toggleNavigationSidebar(): void {
    this.isNavOpen = !this.isNavOpen;
  }
}
