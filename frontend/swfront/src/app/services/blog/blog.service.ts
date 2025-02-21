import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// The Blog interface
export interface Blog {
  _id?: string;
  title: string;
  content: string;
  category: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private baseUrl = 'http://localhost:5000/api/blogs';

  constructor(private http: HttpClient) {}

  // GET all blogs
  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.baseUrl);
  }

  // POST single doc or array => we can type as "any" or "Blog | Blog[]" 
  // but let's keep it simple by re-typing it as Blog[] if we plan to insert multiple
  // In practice, you'd likely do a separate method if you want to handle both distinctly.
  createBlog(newData: Partial<Blog> | Array<Partial<Blog>>): Observable<Blog | Blog[]> {
    // If you pass an array, server will do insertMany, if object => single doc
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
