import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Updated Contact interface with optional fields
export interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = 'http://wixhaven/api/contacts';

  constructor(private http: HttpClient) {}

  createContact(newContact: Partial<Contact>): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, newContact);
  }

  getAllContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl);
  }
}
