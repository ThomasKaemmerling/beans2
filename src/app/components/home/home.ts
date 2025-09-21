import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { BeanService } from '../../services/bean';
import { LocalizationService } from '../../services/localization';
import { AddBeanDialogComponent } from '../add-bean-dialog/add-bean-dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  todayBeansCount = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private beanService: BeanService,
    public localization: LocalizationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.beanService.beans$.subscribe(() => {
        this.todayBeansCount = this.beanService.getTodayBeansCount();
      })
    );
    // Re-render texts if language changes (count stays numeric)
    this.subscription.add(
      this.localization.language$.subscribe(() => {
        this.todayBeansCount = this.beanService.getTodayBeansCount();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openAddBeanDialog(): void {
    const dialogRef = this.dialog.open(AddBeanDialogComponent, {
      width: '400px',
      data: { date: new Date() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.beanService.addBean(result.text, result.date);
      }
    });
  }
}
