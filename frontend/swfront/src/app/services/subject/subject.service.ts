import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FinalItem {
  title: string;
  content?: string;

  // NEW
  videoUrl?: string;
  description?: string;
}

export interface ModuleLevel {
  moduleTitle: string; // "Learn" or "Do" or "Resources"
  finalItems: FinalItem[];
}
export interface SectionLevel {
  sectionTitle: string;
  modules: ModuleLevel[];
}
export interface CourseLevel {
  courseTitle: string;
  sections: SectionLevel[];
}
export interface SubjectData {
  subjectTitle: string;     
  courses: CourseLevel[];
    iconUrl?: string;
    bannerUrl?: string;
}


@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private baseUrl = 'http://localhost:5000/api/subjects'; 
  // Make sure your server.js has: app.use('/api/subjects', subjectRoutes)

  constructor(private http: HttpClient) {}

  getAll(): Observable<SubjectData[]> {
    return this.http.get<SubjectData[]>(this.baseUrl);
  }

  getById(id: string): Observable<SubjectData> {
    return this.http.get<SubjectData>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<SubjectData>): Observable<SubjectData> {
    return this.http.post<SubjectData>(this.baseUrl, data);
  }

  update(id: string, data: Partial<SubjectData>): Observable<SubjectData> {
    return this.http.put<SubjectData>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
