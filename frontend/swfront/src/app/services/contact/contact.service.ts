import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1) Define our Contact interface
export interface Contact {
  _id?: string;
  name: string;
  email: string;
  message: string;
  createdAt?: Date;
}

// 2) Mark the service as Injectable
@Injectable({
  providedIn: 'root'
})
export class ContactService {

  // 3) URL to our backend's contact endpoints
  private baseUrl = 'http://localhost:5000/api/contacts';

  constructor(private http: HttpClient) {}

  // 4) POST a new contact submission
  createContact(newContact: Partial<Contact>): Observable<Contact> {
    // The route expects an object with { name, email, message }
    return this.http.post<Contact>(this.baseUrl, newContact);
  }

  // (Optional) GET all contact submissions if you want
  getAllContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl);
  }

  // (Optional) getContactById, updateContact, etc.
}
