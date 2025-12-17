import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { Bean } from '../../models/bean';
import { BeanService } from '../../services/bean';
import { LocalizationService } from '../../services/localization';

@Component({
  selector: 'app-bean-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule
  ],
  templateUrl: './bean-list.html',
  styleUrl: './bean-list.scss'
})
export class BeanListComponent implements OnInit, OnDestroy {
  beans: Bean[] = [];
  filteredBeans: Bean[] = [];
  startDate: Date;
  endDate: Date;
  private subscription: Subscription = new Subscription();

  constructor(
    private beanService: BeanService,
    public localization: LocalizationService,
    private dialog: MatDialog
  ) {
    // Set default date range to last 2 weeks
    this.endDate = new Date();
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 14);
  }

  ngOnInit(): void {
    this.subscription.add(
      this.beanService.beans$.subscribe(beans => {
        this.beans = beans;
        this.filterBeans();
      })
    );
    this.subscription.add(
      this.localization.language$.subscribe(() => this.filterBeans())
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  filterBeans(): void {
    this.filteredBeans = this.beanService.getBeansInDateRange(this.startDate, this.endDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  deleteBean(beanId: string): void {
    if (confirm(this.localization.translate('realyDeleteBean'))) {
      this.beanService.deleteBean(beanId);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
  return date.toLocaleDateString(this.localization.getCurrentLocale());
  }
}
