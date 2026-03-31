import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PropertyService, Property } from '../../../core/services/property.service';
import { ChatComponent } from '../../chat/chat.component';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, ChatComponent, RouterLink],
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.css'
})
export class PropertyDetailComponent implements OnInit {
  property: Property | null = null;
  loading = true;
  
  isLightboxOpen = false;
  currentImageIndex = 0;
  isChatOpen = false;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) {}

  @HostListener('document:keydown.escape', ['$event']) 
  onKeydownHandler(event: any) {
    this.closeLightbox();
  }

  @HostListener('document:keydown.arrowright', ['$event']) 
  onRightHandler(event: any) {
    if (this.isLightboxOpen) this.nextImage(event);
  }

  @HostListener('document:keydown.arrowleft', ['$event']) 
  onLeftHandler(event: any) {
    if (this.isLightboxOpen) this.prevImage(event);
  }

  openLightbox(index: number): void {
    if (this.property && this.property.images && this.property.images.length > 0) {
      this.currentImageIndex = index;
      this.isLightboxOpen = true;
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
    document.body.style.overflow = 'auto';
  }

  nextImage(event?: Event): void {
    if (event) event.stopPropagation();
    if (this.property && this.property.images) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.property.images.length;
    }
  }

  prevImage(event?: Event): void {
    if (event) event.stopPropagation();
    if (this.property && this.property.images) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.property.images.length) % this.property.images.length;
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.propertyService.getProperty(id).subscribe({
        next: (res) => {
          this.property = res.data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
}

