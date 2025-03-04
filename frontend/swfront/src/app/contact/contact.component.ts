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
  isSubmitting = false;
  formStatus = '';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],  // Optional
      subject: [''], // Optional
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.formStatus = '';
      
      this.contactService.createContact(this.contactForm.value).subscribe({
        next: (savedContact) => {
          this.isSubmitting = false;
          this.formStatus = 'Your message has been sent successfully! I will get back to you soon.';
          this.contactForm.reset();
          
          // Add success class
          const statusElement = document.querySelector('.form-status');
          if (statusElement) {
            statusElement.classList.add('success');
            statusElement.classList.remove('error');
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          this.formStatus = 'Something went wrong. Please try again later.';
          console.error('Error saving contact:', err);
          
          // Add error class
          const statusElement = document.querySelector('.form-status');
          if (statusElement) {
            statusElement.classList.add('error');
            statusElement.classList.remove('success');
          }
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.contactForm.controls).forEach(field => {
        const control = this.contactForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
}
