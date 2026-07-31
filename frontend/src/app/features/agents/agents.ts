import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgentService, Agent } from '../../core/services/agent.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agents.html',
  styleUrl: './agents.css'
})
export class AgentsComponent implements OnInit {
  agents: Agent[] = [];
  loading = true;

  constructor(
    private agentService: AgentService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.agentService.getAgents().subscribe({
      next: (res) => {
        this.agents = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
