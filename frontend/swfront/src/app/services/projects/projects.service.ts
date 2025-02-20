// src/app/services/projects.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1) Import the interface
export interface Project {
  _id?: string;
  title: string;
  description: string;
  stack: string[];
  demoLink?: string;
  thumbnail?: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private baseUrl = 'http://localhost:5000/api/projects'; // Adjust if needed

  constructor(private http: HttpClient) {}

  // GET all projects
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl);
  }

  // POST new project
  createProject(proj: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.baseUrl, proj);
  }

  // GET one project by ID (optional)
  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/${id}`);
  }

  // PUT (update) existing project
  updateProject(id: string, updated: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/${id}`, updated);
  }

  // DELETE a project
  deleteProject(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
