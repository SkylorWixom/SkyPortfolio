// 1) Core imports from Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 2) Define our Blog interface
export interface Blog {
  _id?: string;        
  title: string;
  content: string;
  category: string;    
  createdAt?: Date;    
}

// 3) Mark the service as Injectable
@Injectable({
  providedIn: 'root'
})
export class BlogService {

  // 4) URL to our backend's blog endpoints
  private baseUrl = 'http://localhost:5000/api/blogs';

  // 5) Inject HttpClient into the service
  constructor(private http: HttpClient) {}

  // 6) GET all blogs
  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.baseUrl);
  }

  // 7) POST a new blog
  createBlog(newBlog: Partial<Blog>): Observable<Blog> {
    return this.http.post<Blog>(this.baseUrl, newBlog);
  }

  // 8) GET a single blog by ID
  getBlogById(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.baseUrl}/${id}`);
  }

  // 9) PUT (update) a blog
  updateBlog(id: string, updatedBlog: Partial<Blog>): Observable<Blog> {
    return this.http.put<Blog>(`${this.baseUrl}/${id}`, updatedBlog);
  }

  // 10) DELETE a blog
  deleteBlog(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
