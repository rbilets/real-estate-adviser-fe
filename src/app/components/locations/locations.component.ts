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
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';

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

    dialogRef.afterClosed().subscribe((res) => {
      if (res){
        this.dialog.open(NotificationDialogComponent, {
          data: {
            textToDisplay: 'The city is being added to your locations. It might take some time. You can continue using the app.',
          },
        }).afterClosed().subscribe(() => {
          this.loadLocations()
        })
      }
      
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

  refreshLocations(locationData: LocationData): void {
    this.dialog.open(NotificationDialogComponent, {
      data: {
        textToDisplay: 'The location is being updated. It might take some time. You can continue using the app.',
      },
    }).afterClosed().subscribe(() => {
      this.dataService.addLocation(locationData.location).subscribe(
        () => {
          this.loadLocations();
        },
        (error) => (this.loading = false)
      );
    })
  }
}
