import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ActiveListingsComponent } from './components/active-listings/active-listings.component';
import { ListingInfoComponent } from './components/listing-info/listing-info.component';
import { LocationsComponent } from './components/locations/locations.component';
import { ChartsComponent } from './components/charts/charts.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'active-listings', component: ActiveListingsComponent },
  { path: 'listing-info', component: ListingInfoComponent },
  { path: 'charts', component: ChartsComponent },
];
