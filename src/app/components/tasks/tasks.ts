import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';

import { BeanService } from '../../services/bean';
import { LocalizationService } from '../../services/localization';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  startTime: number;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class TasksComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  currentTask: Task | null = null;
  timeRemaining = 300; // 5 minutes in seconds
  timerRunning = false;
  beansEarned = 0;
  private timerSubscription?: Subscription;
  private readonly STORAGE_KEY = 'beans-tasks-data';

  constructor(
    private beanService: BeanService,
    public localization: LocalizationService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.calculateBeansEarned();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private loadTasks(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.tasks = JSON.parse(stored);
      } catch (error) {
        console.error('Error loading tasks:', error);
        this.tasks = [];
      }
    }
  }

  private saveTasks(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  addTask(text: string): void {
    if (!text.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      startTime: 0
    };
    
    this.tasks.push(newTask);
    this.saveTasks();
  }

  startTask(task: Task): void {
    if (this.timerRunning) return;
    
    this.currentTask = task;
    task.startTime = Date.now();
    this.timeRemaining = 300;
    this.timerRunning = true;
    
    this.timerSubscription = interval(1000).subscribe(() => {
      this.timeRemaining--;
      
      if (this.timeRemaining <= 0) {
        this.completeTask();
      }
    });
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerRunning = false;
  }

  completeTask(): void {
    this.stopTimer();
    
    if (this.currentTask) {
      this.currentTask.completed = true;
      this.saveTasks();
      
      // Add 2 beans for the completed task
      this.beanService.addBean(
        `${this.localization.translate('completedTask')}: ${this.currentTask.text}`,
        new Date()
      );
      this.beanService.addBean(
        `${this.localization.translate('completedTask')}: ${this.currentTask.text}`,
        new Date()
      );
      
      this.calculateBeansEarned();
      this.currentTask = null;
      this.timeRemaining = 300;
    }
  }

  cancelTask(): void {
    this.stopTimer();
    this.currentTask = null;
    this.timeRemaining = 300;
  }

  deleteTask(task: Task): void {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasks();
    
    if (this.currentTask?.id === task.id) {
      this.cancelTask();
    }
  }

  toggleTaskCompletion(task: Task): void {
    task.completed = !task.completed;
    this.saveTasks();
    this.calculateBeansEarned();
  }

  private calculateBeansEarned(): void {
    const completedCount = this.tasks.filter(t => t.completed).length;
    this.beansEarned = completedCount * 2;
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  get incompleteTasks(): Task[] {
    return this.tasks.filter(t => !t.completed);
  }

  get completedTasks(): Task[] {
    return this.tasks.filter(t => t.completed);
  }
}
