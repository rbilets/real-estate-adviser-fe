import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { EstateService, LocationData } from '../../services/estate.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    CanvasJSAngularChartsModule,
  ],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
})
export class ChartsComponent implements OnInit {
  loading = false;
  locationOptions: LocationData[] = [];
  styleOptions: string[] = [];

  formFilters = new FormGroup({
    location: new FormControl<LocationData | null>(null),
    style: new FormControl<string | null>(null),
    min_beds: new FormControl<number | null>(null),
    max_beds: new FormControl<number | null>(null),
    min_baths: new FormControl<number | null>(null),
    max_baths: new FormControl<number | null>(null),
    min_sqft: new FormControl<number | null>(null),
    max_sqft: new FormControl<number | null>(null),
    min_stories: new FormControl<number | null>(null),
    max_stories: new FormControl<number | null>(null),
    year_built: new FormControl<number | null>(null),
  });

  chartOptions = {
    title: {
      text: 'Average price per year',
    },
    data: [
      {
        type: 'line',
        dataPoints: [{ label: '', y: 0 }],
      },
    ],
  };
  chart: any;
  constructor(private dataService: EstateService, private router: Router) {}

  ngOnInit(): void {
    this.loadLocations();

    this.formFilters.controls.location.valueChanges.subscribe((value) =>
      this.selectedLocationChange(value as any)
    );
  }

  loadChartData() {
    if (this.formFilters.controls.location.value) {
      const filters = this.formFilters.value;

      const filteredFilters = Object.keys(filters).reduce((acc, key) => {
        if (
          filters[key as keyof typeof filters] !== null &&
          filters[key as keyof typeof filters] !== undefined
        ) {
          (acc as any)[key] = filters[key as keyof typeof filters];
        }
        return acc;
      }, {} as Partial<typeof filters>);

      this.loading = true;
      this.dataService
        .getTrendChart({
          ...(filteredFilters as any),
          location: this.formFilters.controls.location.value?.location,
        })
        .subscribe((res) => {
          this.styleOptions = res.styles;

          this.chartOptions.data[0].dataPoints = res.chart_data.map((el) => ({
            label: el.year.toString(),
            y: el.avg_price,
          }));

          this.loading = false;
          this.chart?.render();
        });
    }
  }

  loadLocations() {
    this.loading = true;
    this.dataService.getLocations().subscribe((locations) => {
      this.locationOptions = locations;
      this.loading = false;
    });
  }

  selectedLocationChange(value: Location | 'new') {
    if (value === 'new') {
      this.router.navigate(['/locations']);
    } else {
      this.loadChartData();
    }
  }

  getChartInstance(chart: any) {
    this.chart = chart;

    if (location) {
      this.loadChartData();
    }
  }
}
