import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';

import { LocalizationService } from '../../services/localization';

export interface DialogData {
  date: Date;
}

@Component({
  selector: 'app-add-bean-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule
  ],
  templateUrl: './add-bean-dialog.html',
  styleUrl: './add-bean-dialog.scss'
})
export class AddBeanDialogComponent {
  beanText = '';
  selectedDate: Date;

  constructor(
    public dialogRef: MatDialogRef<AddBeanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public localization: LocalizationService
  ) {
    this.selectedDate = data.date;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.beanText.trim()) {
      this.dialogRef.close({
        text: this.beanText.trim(),
        date: this.selectedDate
      });
    }
  }
}
