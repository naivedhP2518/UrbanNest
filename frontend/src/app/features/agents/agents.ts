import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService, Agent } from '../../core/services/agent.service';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agents.html',
  styleUrl: './agents.css'
})
export class AgentsComponent implements OnInit {
  agents: Agent[] = [];
  loading = true;

  constructor(private agentService: AgentService) {}

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
