import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="static-page py-12">
      <div class="container">
        <div class="section-header text-center mb-12">
          <span class="badge">Contact Us</span>
          <h1 class="section-title">Get in <span class="text-gradient">Touch</span> with Us</h1>
          <p class="section-subtitle mx-auto">Have questions? We're here to help you every step of the way.</p>
        </div>

        <div class="contact-grid">
          <div class="contact-info">
            <div class="info-card glass">
              <div class="icon">📍</div>
              <div>
                <h3>Our Office</h3>
                <p>123 Luxury Way, Beverly Hills, CA 90210</p>
              </div>
            </div>
            <div class="info-card glass">
              <div class="icon">📞</div>
              <div>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div class="info-card glass">
              <div class="icon">✉️</div>
              <div>
                <h3>Email</h3>
                <p>hello&#64;realestate.premium</p>
              </div>
            </div>
          </div>

          <div class="contact-form-container glass">
            <form (ngSubmit)="onSubmit()" #contactForm="ngForm">
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" name="name" [(ngModel)]="formData.name" required placeholder="John Doe">
              </div>
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" name="email" [(ngModel)]="formData.email" required placeholder="john&#64;example.com">
              </div>
              <div class="form-group">
                <label>Subject</label>
                <input type="text" name="subject" [(ngModel)]="formData.subject" required placeholder="How can we help?">
              </div>
              <div class="form-group">
                <label>Message</label>
                <textarea name="message" [(ngModel)]="formData.message" rows="5" required placeholder="Your message..."></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-block" [disabled]="!contactForm.valid">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-grid {
      display: grid;
      grid-template-columns: 0.8fr 1.2fr;
      gap: 4rem;
      margin-top: 4rem;
    }
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .info-card {
      padding: 1.5rem;
      border-radius: 24px;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .info-card .icon {
      width: 50px;
      height: 50px;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      font-size: 1.5rem;
    }
    .info-card h3 {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    .info-card p {
      color: var(--text-muted);
      font-size: 0.95rem;
    }
    .contact-form-container {
      padding: 3rem;
      border-radius: 32px;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-group label {
      display: block;
      font-weight: 700;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      color: var(--text);
    }
    .form-group input, .form-group textarea {
      width: 100%;
      padding: 0.85rem 1.25rem;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: #f8fafc;
      font-size: 1rem;
      transition: all 0.3s;
    }
    .form-group input:focus, .form-group textarea:focus {
      outline: none;
      border-color: var(--primary);
      background: white;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }
    .btn-block {
      width: 100%;
    }
    @media (max-width: 992px) {
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
    }
  `]
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  onSubmit() {
    alert('Thank you for your message! Our team will get back to you shortly.');
    this.formData = { name: '', email: '', subject: '', message: '' };
  }
}
