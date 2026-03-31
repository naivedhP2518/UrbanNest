import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-8">
      <div class="form-header mb-12 text-center">
        <h1 class="text-4xl font-extrabold">List Internal <span class="text-gradient">Property</span></h1>
        <p class="text-muted">Fill in the details below to publish your property to the marketplace.</p>
      </div>

      <div class="form-container glass">
        <form (ngSubmit)="onSubmit()" #propForm="ngForm">
          <div class="form-sections">
            <!-- Basic Info -->
            <section class="form-section">
              <h3 class="section-title"><span>1</span> Basic Information</h3>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label>Property Title</label>
                  <input type="text" name="title" [(ngModel)]="property.title" required placeholder="e.g., Modern Villa with Infinity Pool">
                </div>
                <div class="form-group">
                  <label>Price (INR)</label>
                  <input type="number" name="price" [(ngModel)]="property.price" required placeholder="0.00">
                </div>
                <div class="form-group">
                  <label>Listing Type</label>
                  <select name="type" [(ngModel)]="property.type" required>
                    <option value="Sale">For Sale</option>
                    <option value="Rent">For Rent</option>
                  </select>
                </div>
              </div>
            </section>

            <!-- Location & Description -->
            <section class="form-section mt-12">
              <h3 class="section-title"><span>2</span> Location & Details</h3>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label>Full Address</label>
                  <input type="text" name="address" [(ngModel)]="property.address" required placeholder="123 Luxury Way, Area Name">
                </div>
                <div class="form-group">
                  <label>City</label>
                  <input type="text" name="city" [(ngModel)]="property.city" required placeholder="City Name">
                </div>
                <div class="form-group full-width">
                  <label>Description</label>
                  <textarea name="description" [(ngModel)]="property.description" rows="5" required placeholder="Describe the key features and selling points..."></textarea>
                </div>
              </div>
            </section>

            <!-- Media & Amenities -->
            <section class="form-section mt-12">
              <h3 class="section-title"><span>3</span> Media & Amenities</h3>
              
              <div class="media-upload-container">
                <label class="mb-4 d-block font-bold">Property Images</label>
                
                <div class="upload-dropzone" 
                     (dragover)="onDragOver($event)" 
                     (dragleave)="onDragLeave($event)" 
                     (drop)="onDrop($event)"
                     [class.dragging]="isDragging"
                     (click)="fileInput.click()">
                  <div class="upload-icon">📸</div>
                  <div class="upload-text">
                    <p class="main-text">Click or Drag & Drop images here</p>
                    <p class="sub-text">Recommended: 1200x800px, JPG/PNG (Max 5 images)</p>
                  </div>
                  <input type="file" #fileInput (change)="onFileSelected($event)" multiple accept="image/*" hidden>
                </div>

                <!-- Preview Grid -->
                <div class="preview-grid mt-6" *ngIf="previews.length > 0">
                  <div class="preview-card" *ngFor="let preview of previews; let i = index">
                    <img [src]="preview" alt="Preview">
                    <button type="button" class="remove-btn" (click)="removeImage(i)">✕</button>
                    <div class="upload-progress" *ngIf="uploading && i >= uploadedCount">
                      <div class="progress-bar"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="amenities-selection mt-12">
                <label class="mb-4 d-block font-bold">Amenities</label>
                <div class="amenities-grid">
                  <div class="amenity-checkbox" *ngFor="let a of availableAmenities">
                    <input type="checkbox" [id]="a" (change)="toggleAmenity(a)" [checked]="property.amenities.includes(a)">
                    <label [for]="a">{{ a }}</label>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div class="form-actions mt-12">
            <button type="button" class="btn btn-outline" routerLink="/agent/dashboard">Cancel</button>
            <button type="submit" class="btn btn-primary lg" [disabled]="!propForm.valid || loading || uploading">
              {{ loading ? 'Publishing...' : 'Publish Property' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 4rem;
      border-radius: 32px;
    }
    .glass {
      background: white;
      border: 1px solid var(--border);
      box-shadow: 0 20px 40px rgba(0,0,0,0.05);
    }
    .section-title {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 2rem;
      color: var(--text);
    }
    .section-title span {
      width: 32px;
      height: 32px;
      background: var(--primary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .full-width { grid-column: span 2; }
    
    .form-group label {
      display: block;
      font-weight: 700;
      font-size: 0.9rem;
      margin-bottom: 0.6rem;
      color: var(--text);
    }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      padding: 0.85rem 1.25rem;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: #f8fafc;
      font-size: 1rem;
      transition: all 0.3s;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      outline: none;
      border-color: var(--primary);
      background: white;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    /* Upload Styles */
    .upload-dropzone {
      border: 2px dashed var(--border);
      border-radius: 20px;
      padding: 3rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      background: #f8fafc;
    }
    .upload-dropzone:hover, .upload-dropzone.dragging {
      border-color: var(--primary);
      background: rgba(99, 102, 241, 0.05);
    }
    .upload-icon { font-size: 3rem; margin-bottom: 1rem; }
    .main-text { font-weight: 800; font-size: 1.1rem; color: var(--text); margin-bottom: 0.25rem; }
    .sub-text { font-size: 0.85rem; color: var(--text-muted); }

    .preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 1.5rem;
    }
    .preview-card {
      position: relative;
      aspect-ratio: 1;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border);
    }
    .preview-card img { width: 100%; height: 100%; object-fit: cover; }
    .remove-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 28px;
      height: 28px;
      background: rgba(0,0,0,0.5);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      backdrop-filter: blur(4px);
      transition: all 0.2s;
    }
    .remove-btn:hover { background: #ef4444; transform: scale(1.1); }

    .upload-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: rgba(255,255,255,0.3);
    }
    .progress-bar {
      height: 100%;
      background: var(--primary);
      width: 0%;
      animation: progress 2s infinite linear;
    }
    @keyframes progress {
      0% { width: 0%; }
      50% { width: 70%; }
      100% { width: 100%; }
    }

    .amenities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
    }
    .amenity-checkbox {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 10px;
      background: #f8fafc;
      cursor: pointer;
      transition: all 0.2s;
    }
    .amenity-checkbox:hover { background: #f1f5f9; }
    .amenity-checkbox input { margin: 0; cursor: pointer; }
    .amenity-checkbox label { margin: 0; font-weight: 600; font-size: 0.9rem; cursor: pointer; }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border);
    }
    .btn.lg { padding: 1rem 3rem; font-size: 1.1rem; }

    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
      .full-width { grid-column: span 1; }
      .form-container { padding: 2rem; }
    }
  `]
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
