import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { FooterComponent } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main [class.chat-main]="isChatRoute">
      <router-outlet></router-outlet>
    </main>
    <app-footer *ngIf="!isChatRoute"></app-footer>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 80px);
      padding-top: 80px;
    }
    main.chat-main {
      height: 100vh;
      overflow: hidden;
    }
  `]
})
export class AppComponent {
  title = 'Real Estate Website';

  constructor(public router: Router) {}

  get isChatRoute(): boolean {
    return this.router.url.includes('/chat');
  }
}
