import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyService, Property } from '../../core/services/property.service';
import { AgentService } from '../../core/services/agent.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  featuredProperties: Property[] = [];
  loading = true;
  stats = { properties: 0, agents: 0, clients: 0 };

  constructor(
    private propertyService: PropertyService,
    private agentService: AgentService
  ) {}

  ngOnInit(): void {
    // Fetch properties
    this.propertyService.getProperties({}).subscribe({
      next: (res) => {
        // Display only the newest 3 uploaded properties for "Featured" section
        this.featuredProperties = res.data.slice(0, 3);
        this.loading = false;
      },
      error: () => this.loading = false
    });

    // Fetch site stats
    this.agentService.getStats().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.data;
        }
      },
    });
  }
}
