// 1) Core imports from Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 2) Interface describing a Blog
export interface Blog {
  _id?: string;        // Optional because new blogs might not have an ID yet
  title: string;
  content: string;
  category: string;    
  createdAt?: Date;    // Might be auto-assigned or optional
}

// 3) Make this service injectable in the root (global scope)
@Injectable({
  providedIn: 'root'
})

export class BlogService {

  private baseUrl = 'http://localhost:5000/api/blogs';

  // 4) We inject HttpClient to make HTTP requests
  constructor(private http: HttpClient) {}

  // 5) GET all blogs from /api/blogs
  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.baseUrl);
  }

  // 6) POST a new blog to /api/blogs
  createBlog(newBlog: Partial<Blog>): Observable<Blog> {
    return this.http.post<Blog>(this.baseUrl, newBlog);
  }

  // 7) GET a specific blog by ID from /api/blogs/:id
  getBlogById(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.baseUrl}/${id}`);
  }

  // 8) PUT (update) a blog by ID
  updateBlog(id: string, updatedBlog: Partial<Blog>): Observable<Blog> {
    return this.http.put<Blog>(`${this.baseUrl}/${id}`, updatedBlog);
  }

  // 9) DELETE a blog by ID
  deleteBlog(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
