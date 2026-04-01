import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyService, Property } from '../../../core/services/property.service';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-listings.html',
  styleUrl: './my-listings.css'
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

  getPropertyImage(property: Property): string {
    if (property.images && property.images.length > 0) {
      const img = property.images[0];
      return img.startsWith('http') ? img : `http://localhost:5000${img}`;
    }
    return 'assets/modern-home.png';
  }
}
