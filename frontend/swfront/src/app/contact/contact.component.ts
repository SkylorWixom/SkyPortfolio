import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../services/contact/contact.service'; // adjust path
import { Contact } from '../services/contact/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService  // inject here
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      // 1) Call createContact with the form’s values
      this.contactService.createContact(this.contactForm.value).subscribe({
        next: (savedContact) => {
          console.log('Contact saved:', savedContact);
          alert('Message sent successfully!');
          this.contactForm.reset();
        },
        error: (err) => {
          console.error('Error saving contact:', err);
          alert('Could not send message. Please try again later.');
        }
      });
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
