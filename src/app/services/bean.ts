import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bean } from '../models/bean';

@Injectable({
  providedIn: 'root'
})
export class BeanService {
  private readonly STORAGE_KEY = 'beans-app-data';
  private beansSubject = new BehaviorSubject<Bean[]>([]);
  public beans$ = this.beansSubject.asObservable();

  constructor() {
    this.loadBeans();
  }

  private loadBeans(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const beans = JSON.parse(stored);
        this.beansSubject.next(beans);
      } catch (error) {
        console.error('Error loading beans from storage:', error);
        this.beansSubject.next([]);
      }
    }
  }

  private saveBeans(beans: Bean[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(beans));
      this.beansSubject.next(beans);
    } catch (error) {
      console.error('Error saving beans to storage:', error);
    }
  }

  addBean(text: string, date: Date): void {
    const beans = this.beansSubject.value;
    const newBean: Bean = {
      id: Date.now().toString(),
      text: text.trim(),
      date: date.toISOString(),
      insertDate: new Date().toISOString()
    };
    
    const updatedBeans = [...beans, newBean];
    this.saveBeans(updatedBeans);
  }

  deleteBean(beanId: string): void {
    const beans = this.beansSubject.value;
    const updatedBeans = beans.filter(bean => bean.id !== beanId);
    this.saveBeans(updatedBeans);
  }

  getBeansForDate(date: Date): Bean[] {
    const dateStr = date.toISOString().split('T')[0];
    return this.beansSubject.value.filter(bean => 
      bean.date.startsWith(dateStr)
    );
  }

  getTodayBeansCount(): number {
    const today = new Date();
    return this.getBeansForDate(today).length;
  }

  getBeansInDateRange(startDate: Date, endDate: Date): Bean[] {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    
    return this.beansSubject.value.filter(bean => {
      const beanDate = bean.date.split('T')[0];
      return beanDate >= start && beanDate <= end;
    });
  }

  getAllBeans(): Bean[] {
    return this.beansSubject.value;
  }
}
