// src/app/services/course/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ModuleItem {
  title: string;
}
export interface SubLesson {
  title: string;
  modules: ModuleItem[];
}
export interface Lesson {
  title: string;
  subLessons: SubLesson[];
}

/**
 * The shape of your doc:
 * {
 *   title: "learn",
 *   subject: "Computer Science",
 *   subCategory: "Intro to Computer Science",
 *   description: "...",
 *   lessons: [ { title: "learn", subLessons: [...] }, { title: "Do", ... }, ...]
 * }
 */
export interface Course {
  _id?: string;
  title: string;
  subject: string;
  subCategory?: string;
  description?: string;
  lessons: Lesson[];
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = 'http://localhost:5000/api/courses';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl);
  }

  getById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
