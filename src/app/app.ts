import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

import { LocalizationService } from './services/localization';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatDialogModule,
    MatNativeDateModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = 'beans';
  // PWA install prompt
  private deferredInstallPrompt: any | null = null;
  showInstallButton = false;

  constructor(
    public localization: LocalizationService,
    private router: Router,
    private dateAdapter: DateAdapter<Date>
  ) {}

  ngOnInit(): void {
    // Initialize translations
    // Ensure date pickers and formatters use the current locale
    this.dateAdapter.setLocale(this.localization.getCurrentLocale());
    this.localization.language$.subscribe(() => {
      this.dateAdapter.setLocale(this.localization.getCurrentLocale());
    });

    // Listen for the PWA install prompt event
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault();
      this.deferredInstallPrompt = event as any;
      this.showInstallButton = true;
    });

    // Hide install button after successful install
    window.addEventListener('appinstalled', () => {
      this.deferredInstallPrompt = null;
      this.showInstallButton = false;
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  toggleLanguage(): void {
    const currentLang = this.localization.getCurrentLanguage();
    const newLang = currentLang === 'en' ? 'de' : 'en';
    this.localization.setLanguage(newLang);
  }

  async installApp(): Promise<void> {
    if (!this.deferredInstallPrompt) return;
    try {
      const promptEvent = this.deferredInstallPrompt;
      this.deferredInstallPrompt = null; // can only use once
      const result = await promptEvent.prompt?.();
      // Some browsers return a promise on userChoice; handle both cases
      if (promptEvent.userChoice) {
        await promptEvent.userChoice;
      }
    } finally {
      this.showInstallButton = false;
    }
  }
}
