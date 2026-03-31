import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AgentService, Agent } from '../../../core/services/agent.service';
import { PropertyService, Property } from '../../../core/services/property.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-agent-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agent-profile.html',
  styleUrl: './agent-profile.css'
})
export class AgentProfileComponent implements OnInit {
  agent: Agent | null = null;
  agentProperties: Property[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private agentService: AgentService,
    private propertyService: PropertyService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const agentId = this.route.snapshot.paramMap.get('id');
    
    if (agentId) {
      this.fetchAgentData(agentId);
    } else {
      this.error = 'Invalid Agent ID';
      this.loading = false;
    }
  }

  fetchAgentData(agentId: string) {
    // Fetch Agent Details
    this.agentService.getAgent(agentId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.agent = res.data;
        } else {
          this.error = 'Agent not found';
        }
        this.checkLoadingState();
      },
      error: (err) => {
        this.error = 'Failed to load agent profile';
        this.checkLoadingState();
      }
    });

    // Fetch Properties listed by this agent
    this.propertyService.getProperties({ agent: agentId }).subscribe({
      next: (res) => {
        if (res.success) {
          this.agentProperties = res.data;
        }
        this.checkLoadingState();
      },
      error: () => {
        // Just silently fail the properties loading gracefully 
        this.checkLoadingState();
      }
    });
  }

  // Basic check to see if we've resolved from loading (could be optimized with forkJoin)
  private checkLoadingState() {
    this.loading = false; 
  }
}
