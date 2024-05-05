// estate.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstateService {
  private baseUrl = 'https://real-estate-adviser-service.azurewebsites.net'; // replace with your actual backend URL

  constructor(private http: HttpClient) {}

  // Get Active Listings
  getActiveListings(params: {
    location?: string;
    min_price?: number;
    max_price?: number;
    sort_by_year?: number;
    amount?: number;
  }): Observable<PropertyDetails[]> {
    return this.http.get<PropertyDetails[]>(`${this.baseUrl}/active-listings`, {
      params,
    });
  }

  // Add Location
  addLocation(location: string | null): Observable<any> {
    return this.http.post(`${this.baseUrl}/add_location`, { location })
  }

  // Delete Location
  deleteLocation(location: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete_location`, {
      params: { location },
    });
  }

  // Get Locations
  getLocations(): Observable<LocationData[]> {
    return this.http.get<LocationData[]>(`${this.baseUrl}/locations`);
  }

  getTrendChart(params: {
    location: string;
    min_beds?: number;
    max_beds?: number;
    min_baths?: number;
    max_baths?: number;
    min_sqft?: number;
    max_sqft?: number;
    min_stories?: number;
    max_stories?: number;
    year_built?: number;
  }): Observable<PropertyData> {
    return this.http.get<PropertyData>(`${this.baseUrl}/trend_chart`, {
      params,
    });
  }
}

export interface LocationData {
  city: string;
  file_name: string;
  last_modified: string;
  location: string;
  size_mb: number;
  state: string;
}

export interface PropertyDetails {
  alt_photos: string[];
  baths: number;
  beds: number;
  city: string;
  days_on_mls: number;
  distance_to_downtown: number;
  full_baths: number;
  half_baths: number | null;
  hoa_fee: number;
  last_sold_date: string;
  latitude: number;
  list_date: string;
  list_price: number;
  longitude: number;
  lot_sqft: number;
  mls: string;
  mls_id: string;
  parking_garage: number;
  predicted_prices: {
    percentage: number;
    sold_price: number;
    sold_year: number;
  }[]; // You need to define the structure of predicted prices
  price_per_sqft: number;
  primary_photo: string;
  property_url: string;
  sort_percentage: number;
  sqft: number;
  state: string;
  status: string;
  stories: number;
  street: string;
  style: string;
  unit: string;
  year_built: number;
  zip_code: string;
}

interface ChartData {
  year: number;
  avg_price: number;
  properties_sold: number;
  percentage_change: number | null;
}

interface PropertyData {
  styles: string[];
  avg_year_percent_change: number;
  chart_data: ChartData[];
}
