import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EstateService, LocationData } from '../../services/estate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressBarModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  locationOptions: LocationData[] = [];
  selectedLocation: LocationData | null = null;
  loading = false;

  constructor(private dataService: EstateService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.dataService.getLocations().subscribe((locations) => {
      this.locationOptions = locations;
      this.loading = false;
    });
  }

  selectedLocationChange(value: Location | 'new') {
    if (value === 'new') {
      this.router.navigate(['/locations']);
    }
  }

  searchActiveListings() {
    if (this.selectedLocation && (this.selectedLocation as any) !== 'new') {
      this.router.navigate(['/active-listings'], {
        queryParams: { location: this.selectedLocation.location },
      });
    }
  }
}
