import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  type: 'Sale' | 'Rent';
  amenities: string[];
  images: string[];
  agent: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:5000/api/properties';

  constructor(private http: HttpClient) {}

  getProperties(filters: any = {}): Observable<{ success: boolean; count: number; data: Property[] }> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get<{ success: boolean; count: number; data: Property[] }>(this.apiUrl, { params });
  }

  getProperty(id: string): Observable<{ success: boolean; data: Property }> {
    return this.http.get<{ success: boolean; data: Property }>(`${this.apiUrl}/${id}`);
  }

  createProperty(propertyData: any): Observable<{ success: boolean; data: Property }> {
    return this.http.post<{ success: boolean; data: Property }>(this.apiUrl, propertyData);
  }

  uploadImages(formData: FormData): Observable<{ success: boolean; data: string[] }> {
    return this.http.post<{ success: boolean; data: string[] }>('http://localhost:5000/api/upload', formData);
  }
}
