import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { EstateService } from '../../services/estate.service';

@Component({
  selector: 'app-add-location-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinner,
  ],
  templateUrl: './add-location-dialog.component.html',
  styleUrl: './add-location-dialog.component.scss',
})
export class AddLocationDialogComponent {
  locationControl = new FormControl<string>('', [Validators.required]);
  loading = false;

  constructor(
    private dataService: EstateService,
    private dialogRef: MatDialogRef<AddLocationDialogComponent>
  ) {}

  onSave() {
    if (this.locationControl.valid) {
      this.loading = true;
      const location = this.locationControl.value;
      this.loading = false;
      this.dialogRef.close();

      this.dataService.addLocation(location).subscribe({
        next: (res) => {
        },
        error: (error) => {
          this.loading = false;
        },
      });
    }
  }
}
