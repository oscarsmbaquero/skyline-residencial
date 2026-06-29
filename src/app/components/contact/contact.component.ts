import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
  consent: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  submitted = false;

  form: ContactForm = {
    name: '',
    phone: '',
    email: '',
    interest: '',
    message: '',
    consent: false,
  };

  onSubmit(): void {
    this.submitted = true;
  }

  reset(): void {
    this.submitted = false;
    this.form = { name: '', phone: '', email: '', interest: '', message: '', consent: false };
  }
}
