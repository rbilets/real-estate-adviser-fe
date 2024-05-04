import { Component, OnInit } from '@angular/core';
import { EstateService, LocationData } from '../../services/estate.service';
import { MatDialog } from '@angular/material/dialog';
import { AddLocationDialogComponent } from '../add-location-dialog/add-location-dialog.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
  ],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss',
})
export class LocationsComponent implements OnInit {
  displayedColumns: string[] = [
    'city',
    'state',
    'last_updated',
    'size',
    'score',
    'actions',
  ];
  locations: LocationData[] = [];
  loading = false;

  constructor(private dataService: EstateService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.loading = true;
    this.dataService.getLocations().subscribe((data) => {
      this.locations = data;
      this.loading = false;
    });
  }

  addLocation(): void {
    const dialogRef = this.dialog.open(AddLocationDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadLocations();
    });
  }

  deleteLocation(locationData: LocationData): void {
    this.loading = true;
    this.dataService.deleteLocation(locationData.location).subscribe(
      () => {
        this.loading = false;
        this.loadLocations();
      },
      (error) => (this.loading = false)
    );
  }

  refreshLocations(): void {
    this.loadLocations();
  }
}
