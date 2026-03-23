import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="agent-layout">
      <main class="dashboard-content py-12">
        <div class="container xl">
          <div class="dashboard-header mb-12">
            <div>
              <h1 class="text-4xl font-extrabold tracking-tight">Agent Dashboard</h1>
              <p class="text-muted text-lg mt-2">Welcome back! Manage your property portfolio and leads with ease.</p>
            </div>
            <a routerLink="/agent/add-property" class="btn btn-primary btn-lg rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>Add New Property</span>
            </a>
          </div>

          <!-- Stats Grid -->
          <div class="stats-grid mb-12">
            <div class="stat-card premium-card">
              <div class="stat-icon listings">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">Total Listings</span>
                <h2 class="stat-value">12</h2>
                <div class="stat-badge positive">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                   <span>+2 this month</span>
                </div>
              </div>
            </div>
            <div class="stat-card premium-card">
              <div class="stat-icon leads">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">Total Leads</span>
                <h2 class="stat-value">48</h2>
                <div class="stat-badge positive">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                   <span>+15% week</span>
                </div>
              </div>
            </div>
            <div class="stat-card premium-card">
              <div class="stat-icon views">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">Property Views</span>
                <h2 class="stat-value">2.4k</h2>
                <div class="stat-badge positive">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                   <span>+124 today</span>
                </div>
              </div>
            </div>
            <div class="stat-card premium-card">
              <div class="stat-icon performance">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div class="stat-info">
                <span class="stat-label">Conv. Rate</span>
                <h2 class="stat-value">4.2%</h2>
                <div class="stat-badge negative">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                   <span>-0.5%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="dashboard-main-grid">
            <!-- Recent Inquiries -->
            <div class="inquiries-section premium-card">
              <div class="section-header">
                <h3 class="text-xl font-extrabold">Recent Inquiries</h3>
                <a routerLink="/agent/messages" class="view-all">View All</a>
              </div>
              <div class="inquiry-list mt-6">
                <div class="inquiry-item" *ngFor="let i of [1,2,3,4]">
                  <div class="user-avatar-premium">JD</div>
                  <div class="inquiry-details">
                    <h4 class="font-bold text-base">John Doe</h4>
                    <p class="property-ref">Interested in: <span>Modern Villa in Mumbai</span></p>
                    <p class="inquiry-date">2 hours ago</p>
                  </div>
                  <button class="btn-chat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="activity-section premium-card">
              <div class="section-header">
                <h3 class="text-xl font-extrabold">Activity Log</h3>
              </div>
              <div class="activity-list mt-6">
                <div class="activity-item">
                  <div class="activity-icon-bullet blue"></div>
                  <p><b>Modern Villa</b> status updated to <span class="badge pending">Pending</span></p>
                </div>
                <div class="activity-item">
                  <div class="activity-icon-bullet green"></div>
                  <p>New listing <b>Luxury Penthouse</b> published</p>
                </div>
                <div class="activity-item">
                  <div class="activity-icon-bullet orange"></div>
                  <p>Price revised for <b>Beachfront Condo</b></p>
                </div>
                <div class="activity-item">
                  <div class="activity-icon-bullet purple"></div>
                  <p><b>2 new messages</b> from potential buyers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .container.xl { max-width: 1400px; }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 2rem;
      margin-bottom: 4rem;
    }
    .text-gradient {
      background: linear-gradient(135deg, var(--primary), #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 5rem;
    }
    .premium-card {
      background: white;
      padding: 2.5rem;
      border-radius: 32px;
      border: 1px solid rgba(0,0,0,0.04);
      box-shadow: 0 10px 30px rgba(0,0,0,0.02);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(99, 102, 241, 0.08);
      border-color: rgba(99, 102, 241, 0.1);
    }
    .stat-icon {
      width: 72px;
      height: 72px;
      border-radius: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-icon svg { width: 32px; height: 32px; }
    
    .stat-icon.listings { background: #f5f3ff; color: var(--primary); }
    .stat-icon.leads { background: #ecfdf5; color: #059669; }
    .stat-icon.views { background: #fffbeb; color: #d97706; }
    .stat-icon.performance { background: #fef2f2; color: #dc2626; }
    
    .stat-label { color: var(--text-muted); font-size: 1rem; font-weight: 700; letter-spacing: 0.01em; }
    .stat-value { font-size: 2.5rem; font-weight: 900; margin: 0.25rem 0; letter-spacing: -0.01em; }
    
    .stat-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 0.75rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 800;
    }
    .stat-badge svg { width: 14px; height: 14px; }
    .stat-badge.positive { background: rgba(16, 185, 129, 0.1); color: #059669; }
    .stat-badge.negative { background: rgba(239, 68, 68, 0.1); color: #dc2626; }

    .dashboard-main-grid {
      display: grid;
      grid-template-columns: 1.8fr 1fr;
      gap: 2.5rem;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .view-all { color: var(--primary); font-weight: 800; font-size: 0.95rem; text-decoration: none; border-bottom: 2px solid transparent; transition: all 0.3s; }
    .view-all:hover { border-color: var(--primary); }
    
    .inquiry-list { display: flex; flex-direction: column; gap: 1.25rem; }
    .inquiry-item {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem;
      border-radius: 24px;
      background: #fdfdfd;
      border: 1px solid rgba(0,0,0,0.02);
      transition: all 0.3s;
    }
    .inquiry-item:hover { 
      background: white; 
      box-shadow: 0 10px 25px rgba(0,0,0,0.04);
      transform: scale(1.02);
    }
    .user-avatar-premium {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, var(--primary), #a855f7);
      color: white;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.2rem;
    }
    .inquiry-details { flex: 1; }
    .property-ref { font-size: 0.95rem; color: var(--text-muted); margin: 4px 0; }
    .property-ref span { color: var(--primary); font-weight: 700; }
    .inquiry-date { font-size: 0.85rem; color: var(--text-muted); opacity: 0.7; font-weight: 500; }
    
    .btn-chat-icon {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: white;
      border: 1.5px solid var(--border);
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-chat-icon svg { width: 20px; height: 20px; }
    .btn-chat-icon:hover { 
      background: var(--primary); 
      color: white; 
      border-color: var(--primary);
      box-shadow: 0 8px 16px rgba(99, 102, 241, 0.25);
    }
    
    .activity-list { display: flex; flex-direction: column; gap: 1.75rem; }
    .activity-item { display: flex; align-items: flex-start; gap: 1.25rem; font-size: 1rem; }
    .activity-icon-bullet { width: 12px; height: 12px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; box-shadow: 0 0 0 4px rgba(0,0,0,0.02); }
    .activity-icon-bullet.blue { background: var(--primary); }
    .activity-icon-bullet.green { background: #10b981; }
    .activity-icon-bullet.orange { background: #f59e0b; }
    .activity-icon-bullet.purple { background: #a855f7; }

    .badge {
      padding: 0.25rem 0.6rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 800;
      text-transform: uppercase;
    }
    .badge.pending { background: #fff7ed; color: #c2410c; }

    @media (max-width: 1200px) {
      .dashboard-main-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .dashboard-header { flex-direction: column; align-items: flex-start; }
      .premium-card { padding: 1.5rem; }
    }
  `]
})
export class AgentDashboardComponent implements OnInit {
  constructor(private propertyService: PropertyService) {}
  ngOnInit(): void {}
}
