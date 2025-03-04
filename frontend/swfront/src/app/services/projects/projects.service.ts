import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  _id?: string;
  title: string;
  description: string;
  stack: string[];
  demoLink?: string;
  githubLink?: string;
  imageUrl?: string;
  category?: string;
  date?: string;
  featured?: boolean;
  thumbnail?: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  // Make sure this matches your backend route: 'https://wixhaven.com/api/projects'
  private baseUrl = 'https://wixhaven.com/api/projects';

  constructor(private http: HttpClient) {}

  // GET all
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl);
  }

  // POST
  createProject(proj: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.baseUrl, proj);
  }

  // GET by ID (optional)
  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/${id}`);
  }

  // PUT
  updateProject(id: string, updated: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/${id}`, updated);
  }

  // DELETE
  deleteProject(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
