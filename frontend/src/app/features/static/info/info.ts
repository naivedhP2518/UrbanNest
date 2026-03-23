import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="static-page py-12">
      <div class="container">
        <div class="info-layout">
          <div class="info-content-area glass">
            <h1>{{ pageData.title }}</h1>
            <p class="last-updated">Last Updated: March 2026</p>
            
            <div [innerHTML]="pageData.content" class="dynamic-content"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .info-layout {
      max-width: 900px;
      margin: 0 auto;
    }
    .info-content-area {
      padding: 4rem;
      border-radius: 32px;
    }
    h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1rem;
      color: var(--text);
    }
    .last-updated {
      color: var(--text-muted);
      font-weight: 600;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border);
    }
    .dynamic-content {
      line-height: 1.8;
      color: var(--text);
    }
    ::ng-deep .dynamic-content h2 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
    }
    ::ng-deep .dynamic-content p {
      margin-bottom: 1.25rem;
      color: var(--text-muted);
    }
    ::ng-deep .dynamic-content ul {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
    }
    ::ng-deep .dynamic-content li {
      margin-bottom: 0.5rem;
      color: var(--text-muted);
    }
  `]
})
export class InfoPageComponent implements OnInit {
  pageData: any = { title: '', content: '' };

  private pages: any = {
    'privacy': {
      title: 'Privacy Policy',
      content: `
        <h2>Our Commitment</h2>
        <p>At RealEstate, your privacy is our top priority. This policy outlines how we collect, use, and protect your personal information.</p>
        <h2>Data Collection</h2>
        <p>We collect information you provide directly to us when you create an account, search for properties, or contact an agent.</p>
        <ul>
          <li>Full name and contact information</li>
          <li>Search preferences and history</li>
          <li>Communication with agents</li>
        </ul>
        <h2>How We Use Your Data</h2>
        <p>We use the collected data to provide and improve our services, communicate with you, and personalize your experience.</p>
      `
    },
    'terms': {
      title: 'Terms of Service',
      content: `
        <h2>Acceptance of Terms</h2>
        <p>By accessing or using RealEstate, you agree to be bound by these terms of service and all applicable laws and regulations.</p>
        <h2>User Obligations</h2>
        <p>You are responsible for maintaining the confidentiality of your account information. You agree to use the service only for lawful purposes.</p>
        <h2>Prohibited Activities</h2>
        <ul>
          <li>Using the service for any fraudulent or illegal activity</li>
          <li>Accessing data not intended for your use</li>
          <li>Attempting to interfere with the proper working of the service</li>
        </ul>
      `
    },
    'careers': {
      title: 'Careers',
      content: `
        <h2>Join Our Team</h2>
        <p>We're always looking for talented individuals who are passionate about changing the real estate industry.</p>
        <h2>Why Work With Us?</h2>
        <p>We offer a dynamic, collaborative environment with opportunities for growth and a competitive compensation package.</p>
        <h2>Current Openings</h2>
        <ul>
          <li>Senior Frontend Developer</li>
          <li>Real Estate Market Analyst</li>
          <li>Customer Support Specialist</li>
        </ul>
      `
    },
    'help': {
      title: 'Help Center',
      content: `
        <h2>Frequently Asked Questions</h2>
        <h2>How do I search for properties?</h2>
        <p>You can use the search bar on our homepage to filter results by city, price range, and property type.</p>
        <h2>How do I contact an agent?</h2>
        <p>Each property listing page has a 'Contact Agent' button where you can send a direct message.</p>
        <h2>Is my data secure?</h2>
        <p>Yes, we use industry-standard encryption and security measures to protect your information.</p>
      `
    },
    'sitemap': {
      title: 'Sitemap',
      content: `
        <h2>Quick Navigation</h2>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/properties">Properties</a></li>
          <li><a href="/agents">Agents</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/contact">Contact Us</a></li>
        </ul>
      `
    },
    'security': {
      title: 'Security',
      content: `
        <h2>Our Security Standards</h2>
        <p>We take security seriously and invest in top-tier infrastructure to protect our users and their data.</p>
        <h2>Infrastructure</h2>
        <p>Our platform is hosted on secure cloud servers with multiple layers of protection and regular security audits.</p>
        <h2>User Protection</h2>
        <p>We use two-factor authentication and bank-level encryption for all sensitive transactions.</p>
      `
    }
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.url.subscribe(url => {
      const path = url[0].path;
      this.pageData = this.pages[path] || { title: 'Not Found', content: '<p>The requested page was not found.</p>' };
    });
  }
}
