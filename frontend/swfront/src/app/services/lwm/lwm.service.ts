import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** 
 * The interface representing each nested item (mirroring your child MenuItem).
 * "children" is optional if you want infinite nesting. 
 */
export interface MenuItem {
  title: string;
  placeholderContent?: string;
  children?: MenuItem[];
}

/**
 * Each doc in your lwms collection, storing an array of "items".
 * If your schema calls it something else, adjust the field name here.
 */
export interface LwmDoc {
  _id?: string;
  items: MenuItem[]; 
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LwmService {

  // Points to your backend route. Adjust the port or path if needed.
  private baseUrl = 'http://localhost:5000/api/lwm';

  constructor(private http: HttpClient) {}

  /**
   * GET all Lwm docs from the backend.
   * If your route returns an array, we type it as Observable<LwmDoc[]>.
   */
  getAllLwm(): Observable<LwmDoc[]> {
    return this.http.get<LwmDoc[]>(this.baseUrl);
  }

  /**
   * Optional: create a new Lwm doc 
   * if you want to add data from the frontend.
   */
  createLwm(doc: Partial<LwmDoc>): Observable<LwmDoc> {
    return this.http.post<LwmDoc>(this.baseUrl, doc);
  }
  
  // Similarly, you could define getById, update, etc. if needed.
}
