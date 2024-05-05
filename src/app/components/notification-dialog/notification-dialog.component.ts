import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './notification-dialog.component.html',
  styleUrl: './notification-dialog.component.scss'
})
export class NotificationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {textToDisplay: string}) {}
}
