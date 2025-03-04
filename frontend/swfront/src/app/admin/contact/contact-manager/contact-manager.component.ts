import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, Contact } from '../../../services/contact/contact.service';

@Component({
  selector: 'app-contact-manager',
  templateUrl: './contact-manager.component.html',
  styleUrls: ['./contact-manager.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ContactManagerComponent implements OnInit {
  contacts: Contact[] = [];
  newContact: Contact = this.getEmptyContact();

  successMessage = '';
  errorMessage = '';

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getAllContacts().subscribe({
      next: (data) => {
        this.contacts = data;
      },
      error: (err) => {
        this.errorMessage = `Failed to load contacts: ${err.message}`;
      }
    });
  }

  createNewContact(): void {
    this.contactService.createContact(this.newContact).subscribe({
      next: (created) => {
        this.successMessage = 'Contact created successfully!';
        this.errorMessage = '';
        this.contacts.push(created);
        this.newContact = this.getEmptyContact();
      },
      error: (err) => {
        this.errorMessage = `Failed to create contact: ${err.message}`;
        this.successMessage = '';
      }
    });
  }

  // === ADD THIS for DELETE ===
  deleteContact(contactId: string): void {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    this.contactService.deleteContact(contactId).subscribe({
      next: (res) => {
        this.successMessage = 'Contact deleted successfully!';
        this.errorMessage = '';
        // Remove the contact from the local array
        this.contacts = this.contacts.filter(c => c._id !== contactId);
      },
      error: (err) => {
        this.errorMessage = `Failed to delete contact: ${err.message}`;
        this.successMessage = '';
      }
    });
  }

  private getEmptyContact(): Contact {
    return {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
  }
}
