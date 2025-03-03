// blog.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Extended Blog interface
export interface Blog {
  _id?: string;
  title: string;
  author?: string;           // new field
  content: string;
  category: string;
  bannerImageUrl?: string;   // new field
  references?: string[];     // new field
  tags?: string[];           // optional new field
  createdAt?: Date;
  excerpt?: string;          // Add this property to fix the TypeScript error
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrl = 'http://wixhaven/api/blogs';

  constructor(private http: HttpClient) {}

  // GET all blogs
  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.baseUrl);
  }

  // POST single doc or array
  createBlog(newData: Partial<Blog> | Array<Partial<Blog>>): Observable<Blog | Blog[]> {
    return this.http.post<Blog | Blog[]>(this.baseUrl, newData);
  }

  // GET a single blog by ID
  getBlogById(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.baseUrl}/${id}`);
  }

  // PUT update
  updateBlog(id: string, updatedBlog: Partial<Blog>): Observable<Blog> {
    return this.http.put<Blog>(`${this.baseUrl}/${id}`, updatedBlog);
  }

  // DELETE
  deleteBlog(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
