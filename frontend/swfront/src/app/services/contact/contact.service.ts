// File: contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private baseUrl = 'https://wixhaven.com/api/contacts';

  constructor(private http: HttpClient) {}

  createContact(newContact: Partial<Contact>): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, newContact);
  }

  getAllContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl);
  }

  // === ADD THIS for DELETE ===
  deleteContact(contactId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${contactId}`);
  }
}
