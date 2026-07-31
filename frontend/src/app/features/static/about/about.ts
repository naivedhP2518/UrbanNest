import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="static-page py-12">
      <div class="container">
        <div class="section-header text-center mb-12">
          <span class="badge">About Us</span>
          <h1 class="section-title">Redefining the <span class="text-gradient">Real Estate</span> Experience</h1>
          <p class="section-subtitle mx-auto">We combine modern technology with deep industry expertise to help you find more than just a house—we help you find a home.</p>
        </div>

        <div class="about-grid">
          <div class="about-content">
            <h2>Our Mission</h2>
            <p>At RealEstate, we believe that everyone deserves a premium experience when searching for their dream home. Our platform is designed to make the process transparent, efficient, and enjoyable.</p>
            <div class="stats-row mt-8">
              <div class="stat-item">
                <span class="stat-val">10+</span>
                <span class="stat-label">Years Experience</span>
              </div>
              <div class="stat-item">
                <span class="stat-val">5k+</span>
                <span class="stat-label">Properties Sold</span>
              </div>
              <div class="stat-item">
                <span class="stat-val">98%</span>
                <span class="stat-label">Happy Clients</span>
              </div>
            </div>
            <a routerLink="/properties" class="btn btn-primary mt-8">Explore Our Listings</a>
          </div>
          <div class="about-image glass">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" alt="Modern Office">
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      margin-top: 4rem;
    }
    .about-content h2 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      color: var(--text);
    }
    .about-content p {
      font-size: 1.1rem;
      color: var(--text-muted);
      line-height: 1.8;
    }
    .stats-row {
      display: flex;
      gap: 3rem;
    }
    .stat-val {
      display: block;
      font-size: 2rem;
      font-weight: 800;
      color: var(--primary);
    }
    .stat-label {
      font-size: 0.9rem;
      color: var(--text-muted);
      font-weight: 600;
    }
    .about-image {
      border-radius: 32px;
      overflow: hidden;
      aspect-ratio: 4/3;
    }
    .about-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    @media (max-width: 992px) {
      .about-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
    }
  `]
})
export class AboutComponent {}
