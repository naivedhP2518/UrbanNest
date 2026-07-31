import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class AgentDashboardComponent implements OnInit {
  totalListings: number = 0;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    // Replace with an agent-specific filter once the backend supports it.
    // Right now we just get the length of available properties as a placeholder
    // for actual dynamic stats.
    this.propertyService.getProperties({}).subscribe({
      next: (res) => {
        if (res.success) {
          this.totalListings = res.data.length;
        }
      },
      error: () => {}
    });
  }
}
