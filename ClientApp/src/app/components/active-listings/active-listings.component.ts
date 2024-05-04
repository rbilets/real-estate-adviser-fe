import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstateService, PropertyDetails } from '../../services/estate.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import * as mapboxgl from 'mapbox-gl';
import { MatDialog } from '@angular/material/dialog';
import { ListingInfoComponent } from '../listing-info/listing-info.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-active-listings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './active-listings.component.html',
  styleUrls: ['./active-listings.component.scss'],
})
export class ActiveListingsComponent implements OnInit {
  location: string = '';
  allActiveListings: PropertyDetails[] = [];
  displayedColumns = [
    'address',
    'baths',
    'beds',
    'sqft',
    'year_built',
    'stories',
    'list_price',
    'sort_percentage',
  ];


  dataSource?: MatTableDataSource<PropertyDetails>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  markers: mapboxgl.Marker[] = [];

  formFilters = new FormGroup({
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
    predictYear: new FormControl<number | null>(null),
    amount: new FormControl<number | null>(null),
  });

  predictedYearOptions = [...Array(2041 - 2024).keys()].map((i) => i + 2024)

  loading = false;

  constructor(
    private dataService: EstateService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.location = params['location'];
      this.getActiveListings(this.location);
    });

    this.formFilters.valueChanges.pipe(debounceTime(300)).subscribe((el) => {
      let filters = {} as any;

      if (el.minPrice) {
        filters.min_price = Number(el.minPrice);
      }

      if (el.maxPrice) {
        filters.max_price = Number(el.maxPrice);
      }

      if (el.predictYear) {
        filters.sort_by_year = Number(el.predictYear);
      }

      if (el.amount) {
        filters.amount = Number(el.amount);
      }

      this.getActiveListings(this.location, filters);
    });
  }

  getActiveListings(
    location: string,
    params?: {
      min_price?: number;
      max_price?: number;
      sort_by_year?: number;
      amount?: number;
    }
  ) {
    this.loading = true;

    const data = { location, ...params };
    this.dataService.getActiveListings(data).subscribe({
      next: (res) => {
        this.allActiveListings = res;
        this.dataSource = new MatTableDataSource(res.slice(0, 25));
        this.dataSource.paginator = this.paginator;

        if (res.length) this.setupMap(res[0].longitude, res[0].latitude);
        // Initialize or update the map
        else this.clearMarkers();

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;

    this.dataSource = new MatTableDataSource(
      this.allActiveListings.slice(startIndex, endIndex)
    );
    this.setupMap(); // Re-setup the map on page change
  }

  setupMap(longitude = 0, latitude = 0) {
    if (!this.map) {
      this.map = new mapboxgl.Map({
        accessToken:
          'pk.eyJ1Ijoicm9tZWswNSIsImEiOiJjbHZiaXdhY20wOGZsMmtycHE3bHl3eTdpIn0.wmP9JHk7zt2JNNIVqUXcSw',
        container: 'map',
        style: this.style,
        zoom: 10,
        center: [longitude, latitude], // Default center
      });

      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.on('load', () => {
        this.map.resize();
      });
    }
    this.clearMarkers();
    this.addMarkers();
  }

  clearMarkers() {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  }

  addMarkers() {
    if (this.dataSource) {
      this.dataSource.data.forEach((property: PropertyDetails) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.textContent = property.sort_percentage.toFixed(2) + '%';
        el.setAttribute(
          'style',
          'color: #fff; background-color: green; padding: 3px 5px; border-radius: 5px; font-weight: bold; cursor: pointer;'
        );

        const marker = new mapboxgl.Marker(el, { draggable: false })
          .setLngLat([property.longitude, property.latitude])
          .addTo(this.map);

        el.addEventListener('click', () => {
          this.openListing(property);
        });

        this.markers.push(marker);
      });
    }
  }

  openListing(propertyDetails: PropertyDetails) {
    this.dialog.open(ListingInfoComponent, {
      data: propertyDetails,
      width: '100vw',
      maxWidth: '100vw',
    });
  }
}
