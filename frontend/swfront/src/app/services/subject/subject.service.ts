import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Resource interface
export interface Resource {
  title: string;
  url: string;
}

export interface FinalItem {
  _id?: string;
  title: string;
  content?: string;
  videoUrl?: string;
  description?: string;
  resources?: Resource[];
}

export interface ModuleLevel {
  _id?: string;
  moduleTitle: string;
  finalItems: FinalItem[];
  expanded?: boolean;
}

export interface SectionLevel {
  _id?: string;
  sectionTitle: string;
  modules: ModuleLevel[];
}

export interface CourseLevel {
  _id?: string;
  courseTitle: string;
  sections: SectionLevel[];
}

export interface SubjectData {
  _id?: string;
  subjectTitle: string;
  iconUrl?: string;
  bannerUrl?: string;
  courses: CourseLevel[];
}

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private baseUrl = 'https://wixhaven.com/api/subjects'; 

  constructor(private http: HttpClient) {}

  // Subject endpoints
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

  // Course endpoints
  createCourse(subjectId: string, courseData: Partial<CourseLevel>): Observable<CourseLevel> {
    return this.http.post<CourseLevel>(`${this.baseUrl}/${subjectId}/courses`, courseData);
  }

  updateCourse(courseId: string, courseData: Partial<CourseLevel>): Observable<CourseLevel> {
    return this.http.put<CourseLevel>(`${this.baseUrl}/courses/${courseId}`, courseData);
  }

  deleteCourse(courseId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/courses/${courseId}`);
  }

  // Section endpoints
  createSection(courseId: string, sectionData: Partial<SectionLevel>): Observable<SectionLevel> {
    return this.http.post<SectionLevel>(`${this.baseUrl}/courses/${courseId}/sections`, sectionData);
  }

  updateSection(sectionId: string, sectionData: Partial<SectionLevel>): Observable<SectionLevel> {
    return this.http.put<SectionLevel>(`${this.baseUrl}/sections/${sectionId}`, sectionData);
  }

  deleteSection(sectionId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/sections/${sectionId}`);
  }

  // Module endpoints
  createModule(sectionId: string, moduleData: Partial<ModuleLevel>): Observable<ModuleLevel> {
    return this.http.post<ModuleLevel>(`${this.baseUrl}/sections/${sectionId}/modules`, moduleData);
  }

  updateModule(moduleId: string, moduleData: Partial<ModuleLevel>): Observable<ModuleLevel> {
    return this.http.put<ModuleLevel>(`${this.baseUrl}/modules/${moduleId}`, moduleData);
  }

  deleteModule(moduleId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/modules/${moduleId}`);
  }

  // FinalItem endpoints
  createFinalItem(moduleId: string, finalItemData: Partial<FinalItem>): Observable<FinalItem> {
    return this.http.post<FinalItem>(`${this.baseUrl}/modules/${moduleId}/finalItems`, finalItemData);
  }

  updateFinalItem(finalItemId: string, finalItemData: Partial<FinalItem>): Observable<FinalItem> {
    return this.http.put<FinalItem>(`${this.baseUrl}/finalItems/${finalItemId}`, finalItemData);
  }

  deleteFinalItem(finalItemId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/finalItems/${finalItemId}`);
  }
}
