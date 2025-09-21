import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';

import { Bean } from '../../models/bean';
import { BeanService } from '../../services/bean';
import { LocalizationService } from '../../services/localization';

interface ChartData {
  labels: string[];
  data: number[];
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss'
})
export class StatisticsComponent implements OnInit, OnDestroy {
  dailyData: ChartData = { labels: [], data: [] };
  weeklyData: ChartData = { labels: [], data: [] };
  monthlyData: ChartData = { labels: [], data: [] };
  dailyMax = 0;
  weeklyMax = 0;
  monthlyMax = 0;
  private readonly CHART_HEIGHT = 200;
  
  private subscription: Subscription = new Subscription();

  constructor(
    private beanService: BeanService,
    public localization: LocalizationService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.beanService.beans$.subscribe(beans => {
        this.generateStatistics(beans);
      })
    );
    this.subscription.add(
      this.localization.language$.subscribe(() => {
        // Re-generate labels on locale change using current beans
        this.generateStatistics(this.beanService.getAllBeans());
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private generateStatistics(beans: Bean[]): void {
    this.generateDailyStats(beans);
    this.generateWeeklyStats(beans);
    this.generateMonthlyStats(beans);
  }

  private generateDailyStats(beans: Bean[]): void {
    const dailyCount: { [key: string]: number } = {};
    const today = new Date();
    
    // Last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyCount[dateStr] = 0;
    }

    beans.forEach(bean => {
      const dateStr = bean.date.split('T')[0];
      if (dailyCount.hasOwnProperty(dateStr)) {
        dailyCount[dateStr]++;
      }
    });

  const locale = this.localization.getCurrentLocale();
  const labels = Object.keys(dailyCount).map(date => new Date(date).toLocaleDateString(locale));
    const data = Object.values(dailyCount);
    this.dailyData = { labels, data };
    this.dailyMax = Math.max(0, ...data);
  }

  private generateWeeklyStats(beans: Bean[]): void {
    // Last 14 ISO weeks (oldest -> newest)
    const weeks: { key: string; year: number; week: number; label: string }[] = [];
    const today = new Date();
    // Start from current week's Monday
    const currentMonday = this.getMonday(today);
    for (let i = 13; i >= 0; i--) {
      const d = new Date(currentMonday);
      d.setDate(d.getDate() - i * 7);
      const { week, year } = this.getIsoWeekYear(d);
      const key = `${year}-W${String(week).padStart(2, '0')}`;
      const label = `${this.localization.translate('cw')}${week} ${year}`;
      weeks.push({ key, year, week, label });
    }

    const weeklyCount: Record<string, number> = Object.fromEntries(weeks.map(w => [w.key, 0]));
    beans.forEach(bean => {
      const d = new Date(bean.date);
      const { week, year } = this.getIsoWeekYear(d);
      const key = `${year}-W${String(week).padStart(2, '0')}`;
      if (weeklyCount[key] !== undefined) weeklyCount[key]++;
    });

  const labels = weeks.map(w => w.label);
    const data = weeks.map(w => weeklyCount[w.key]);
    this.weeklyData = { labels, data };
    this.weeklyMax = Math.max(0, ...data);
  }

  private generateMonthlyStats(beans: Bean[]): void {
    // Last 12 months including current (oldest -> newest)
    const months: { key: string; date: Date; label: string }[] = [];
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    for (let i = 11; i >= 0; i--) {
      const d = new Date(start.getFullYear(), start.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString(undefined, { month: 'short', year: 'numeric' });
      months.push({ key, date: d, label });
    }

    const monthlyCount: Record<string, number> = Object.fromEntries(months.map(m => [m.key, 0]));
    beans.forEach(bean => {
      const d = new Date(bean.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyCount[key] !== undefined) monthlyCount[key]++;
    });

  const labels = months.map(m => m.label);
    const data = months.map(m => monthlyCount[m.key]);
    this.monthlyData = { labels, data };
    this.monthlyMax = Math.max(0, ...data);
  }

  // Helpers
  private getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sun) .. 6 (Sat)
    const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private getIsoWeekYear(date: Date): { week: number; year: number } {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Thursday in current week decides the year
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return { week, year: d.getUTCFullYear() };
  }

  getBarHeight(value: number, max: number): number {
    if (!max || max <= 0) return 2;
    return Math.max(2, Math.round((value / max) * this.CHART_HEIGHT));
  }
}
