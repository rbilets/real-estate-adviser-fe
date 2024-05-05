import { MatCardModule } from '@angular/material/card';
import { Component, Inject, OnInit } from '@angular/core';
import { PropertyDetails } from '../../services/estate.service';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ImageGalleryComponent } from '../image-gallery/image-gallery.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-listing-info',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    ImageGalleryComponent,
  ],
  templateUrl: './listing-info.component.html',
  styleUrl: './listing-info.component.scss',
})
export class ListingInfoComponent implements OnInit {
  allPhotos = [...this.data.alt_photos];
  constructor(@Inject(MAT_DIALOG_DATA) public data: PropertyDetails) {}

  ngOnInit(): void {}
}
