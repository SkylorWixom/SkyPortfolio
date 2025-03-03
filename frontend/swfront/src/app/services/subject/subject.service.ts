import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Add a Resource interface first
export interface Resource {
  title: string;
  url: string;
}

export interface FinalItem {
  title: string;
  content?: string;
  videoUrl?: string;
  description?: string;
  // Add the missing resources property
  resources?: Resource[];
}

export interface ModuleLevel {
  moduleTitle: string; // "Learn" or "Do" or "Resources"
  finalItems: FinalItem[];
  expanded?: boolean; // For UI state
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
  private baseUrl = 'https://wixhaven.com/api/subjects'; 

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
