import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Agent {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  experience?: number;
  happyClients?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAgents(): Observable<{ success: boolean; count: number; data: Agent[] }> {
    return this.http.get<{ success: boolean; count: number; data: Agent[] }>(`${this.apiUrl}/agents`);
  }

  getAgent(id: string): Observable<{ success: boolean; data: Agent }> {
    return this.http.get<{ success: boolean; data: Agent }>(`${this.apiUrl}/agents/${id}`);
  }

  getStats(): Observable<{ success: boolean; data: { properties: number; agents: number; clients: number } }> {
    return this.http.get<{ success: boolean; data: { properties: number; agents: number; clients: number } }>(`${this.apiUrl}/stats`);
  }
}
