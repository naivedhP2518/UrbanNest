import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService, Property } from '../../core/services/property.service';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './properties.html',
  styleUrl: './properties.css'
})
export class PropertiesComponent implements OnInit {
  properties: Property[] = [];
  loading = true;
  filters = {
    city: '',
    type: '',
    minPrice: null,
    maxPrice: null
  };

  isCityDropdownOpen = false;
  isTypeDropdownOpen = false;

  cities = [
    { value: '', label: 'All Cities' },
    { value: 'New York', label: 'New York' },
    { value: 'Los Angeles', label: 'Los Angeles' },
    { value: 'Chicago', label: 'Chicago' }
  ];

  types = [
    { value: '', label: 'All Types' },
    { value: 'Sale', label: 'For Sale' },
    { value: 'Rent', label: 'For Rent' }
  ];

  constructor(
    private propertyService: PropertyService,
    private eRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.isCityDropdownOpen = false;
      this.isTypeDropdownOpen = false;
    }
  }

  toggleCityDropdown() {
    this.isCityDropdownOpen = !this.isCityDropdownOpen;
    this.isTypeDropdownOpen = false;
  }

  toggleTypeDropdown() {
    this.isTypeDropdownOpen = !this.isTypeDropdownOpen;
    this.isCityDropdownOpen = false;
  }

  selectCity(value: string) {
    this.filters.city = value;
    this.isCityDropdownOpen = false;
    this.applyFilters();
  }

  selectType(value: string) {
    this.filters.type = value;
    this.isTypeDropdownOpen = false;
    this.applyFilters();
  }

  getCityLabel() {
    return this.cities.find(c => c.value === this.filters.city)?.label || 'All Cities';
  }

  getTypeLabel() {
    return this.types.find(t => t.value === this.filters.type)?.label || 'All Types';
  }

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading = true;
    this.propertyService.getProperties(this.filters).subscribe({
      next: (res) => {
        this.properties = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.loadProperties();
  }
}

