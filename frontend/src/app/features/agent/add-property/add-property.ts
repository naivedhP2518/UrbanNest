import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-property.html',
  styleUrl: './add-property.css'
})
export class AddPropertyComponent {
  property: any = {
    title: '',
    description: '',
    price: null,
    address: '',
    city: '',
    type: 'Sale',
    amenities: [],
    images: []
  };

  files: File[] = [];
  previews: string[] = [];
  availableAmenities = ['Swimming Pool', 'Gym', 'Parking', 'Security', 'AC', 'WIFI', 'Garden', 'Modular Kitchen'];
  loading = false;
  uploading = false;
  isDragging = false;
  uploadedCount = 0;

  constructor(private propertyService: PropertyService, private router: Router) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelected(event: any) {
    if (event.target.files) {
      this.handleFiles(event.target.files);
    }
  }

  handleFiles(fileList: FileList) {
    const newFiles = Array.from(fileList).slice(0, 5 - this.files.length);
    this.files.push(...newFiles);
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => this.previews.push(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number) {
    this.files.splice(index, 1);
    this.previews.splice(index, 1);
  }

  toggleAmenity(amenity: string) {
    const index = this.property.amenities.indexOf(amenity);
    if (index > -1) {
      this.property.amenities.splice(index, 1);
    } else {
      this.property.amenities.push(amenity);
    }
  }

  async onSubmit() {
    this.loading = true;
    
    try {
      // 1. Upload Images First
      if (this.files.length > 0) {
        this.uploading = true;
        const formData = new FormData();
        this.files.forEach(file => formData.append('images', file));
        
        const uploadRes = await this.propertyService.uploadImages(formData).toPromise();
        if (uploadRes?.success) {
          this.property.images = uploadRes.data.map(path => `http://localhost:5000${path}`);
        }
        this.uploading = false;
      }

      // 2. Create Property
      this.propertyService.createProperty(this.property).subscribe({
        next: () => {
          alert('Property published successfully!');
          this.router.navigate(['/agent/dashboard']);
          this.loading = false;
        },
        error: (err) => {
          alert('Failed to publish property: ' + (err.error?.message || 'Error occurred'));
          this.loading = false;
        }
      });
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Error occurred'));
      this.loading = false;
      this.uploading = false;
    }
  }
}
