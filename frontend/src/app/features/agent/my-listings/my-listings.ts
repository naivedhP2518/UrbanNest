import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyService, Property } from '../../../core/services/property.service';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-8">
      <div class="header-row mb-8">
        <div>
          <h1 class="text-3xl font-extrabold">My Listings</h1>
          <p class="text-muted">Manage your active, sold, and rented properties.</p>
        </div>
        <a routerLink="/agent/add-property" class="btn btn-primary">
          Add Property
        </a>
      </div>

      <!-- Filters/Tabs -->
      <div class="listing-tabs mb-8 glass">
        <button class="tab-btn active">All Listings (12)</button>
        <button class="tab-btn">Available (8)</button>
        <button class="tab-btn">Sold/Rented (4)</button>
      </div>

      <div class="listings-table-container glass" *ngIf="!loading; else spinner">
        <table class="listings-table" *ngIf="properties.length > 0; else emptyState">
          <thead>
            <tr>
              <th>Property</th>
              <th>Status</th>
              <th>Price</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let property of properties">
              <td class="property-cell">
                <div class="prop-info">
                  <img [src]="property.images[0]" class="prop-thumb" [alt]="property.title">
                  <div>
                    <span class="prop-title">{{ property.title }}</span>
                    <span class="prop-location">{{ property.city }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="status-badge" [class]="property.status.toLowerCase()">
                  {{ property.status }}
                </span>
              </td>
              <td>
                <span class="price-val">{{ property.price | currency:'INR' }}</span>
              </td>
              <td>
                <span class="date-val">{{ property.createdAt | date:'mediumDate' }}</span>
              </td>
              <td class="action-cell">
                <div class="action-buttons">
                  <a [routerLink]="['/agent/edit-property', property._id]" class="btn-action edit" title="Edit">✏️</a>
                  <button class="btn-action delete" (click)="deleteProperty(property._id!)" title="Delete">🗑️</button>
                  <a [routerLink]="['/properties', property._id]" target="_blank" class="btn-action view" title="View Public">👁️</a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <ng-template #emptyState>
          <div class="empty-listings text-center py-20">
            <div class="empty-icon">🏠</div>
            <h3>No Properties Found</h3>
            <p class="text-muted">You haven't added any properties to your profile yet.</p>
            <a routerLink="/agent/add-property" class="btn btn-outline mt-4">Create Your First Listing</a>
          </div>
        </ng-template>
      </div>

      <ng-template #spinner>
        <div class="flex-center py-40">
          <div class="spinner"></div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .glass {
      background: white;
      border-radius: 24px;
      border: 1px solid var(--border);
      overflow: hidden;
    }
    .listing-tabs {
      display: flex;
      padding: 0.5rem;
      gap: 0.5rem;
    }
    .tab-btn {
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      border: none;
      background: transparent;
      font-weight: 700;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.3s;
    }
    .tab-btn:hover { background: #f8fafc; color: var(--text); }
    .tab-btn.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); }

    .listings-table-container { padding: 1rem; }
    .listings-table {
      width: 100%;
      border-collapse: collapse;
    }
    .listings-table th {
      text-align: left;
      padding: 1.25rem 1rem;
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.9rem;
      border-bottom: 2px solid #f1f5f9;
    }
    .listings-table td {
      padding: 1.25rem 1rem;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    .property-cell .prop-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .prop-thumb {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      object-fit: cover;
    }
    .prop-title { display: block; font-weight: 700; color: var(--text); }
    .prop-location { display: block; font-size: 0.85rem; color: var(--text-muted); }

    .status-badge {
      padding: 0.4rem 0.8rem;
      border-radius: 99px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .status-badge.available { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .status-badge.sold { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .status-badge.rented { background: rgba(99, 102, 241, 0.1); color: var(--primary); }

    .price-val { font-weight: 700; color: var(--text); }
    .date-val { color: var(--text-muted); font-size: 0.9rem; }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    .btn-action {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      border: 1px solid var(--border);
      background: white;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-action:hover { transform: scale(1.1); box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
    .btn-action.edit:hover { border-color: var(--primary); background: rgba(99, 102, 241, 0.05); }
    .btn-action.delete:hover { border-color: #ef4444; background: rgba(239, 68, 68, 0.05); }
    
    .empty-icon { font-size: 4rem; margin-bottom: 1.5rem; }
  `]
})
export class MyListingsComponent implements OnInit {
  properties: Property[] = [];
  loading = true;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadAgentBoard();
  }

  loadAgentBoard() {
    this.loading = true;
    // For now, load all and filter or simulate agent context
    // Ideally the backend would have a /agent/properties endpoint
    this.propertyService.getProperties({}).subscribe({
      next: (res) => {
        this.properties = res.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  deleteProperty(id: string) {
    if (confirm('Are you sure you want to delete this property?')) {
      // Logic for deletion would go here
      alert('Delete functionality would call the API here.');
    }
  }
}
