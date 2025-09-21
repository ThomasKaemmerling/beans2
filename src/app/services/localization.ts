import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Translations {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private currentLanguage = 'en';
  private translations: { [lang: string]: Translations } = {};
  private languageSubject = new BehaviorSubject<string>('en');
  public readonly language$ = this.languageSubject.asObservable();

  constructor() {
    this.loadTranslations();
    // Set language from browser preference or localStorage
    const savedLang = localStorage.getItem('beans-app-language');
    const browserLang = navigator.language.split('-')[0];
  this.currentLanguage = savedLang || (browserLang === 'de' ? 'de' : 'en');
  this.languageSubject.next(this.currentLanguage);
  }

  private async loadTranslations(): Promise<void> {
    try {
      // Load English translations
  const enResponse = await fetch('assets/lang/en.json');
      this.translations['en'] = await enResponse.json();

      // Load German translations  
  const deResponse = await fetch('assets/lang/de.json');
      this.translations['de'] = await deResponse.json();
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback translations
      this.translations['en'] = {
        'collectBeans': 'Collect beans',
        'todayCollectedBeans': 'The beans you\nhave collected today:',
        'addBean': 'add bean',
        'beanFor': 'Why you get the bean?',
        'beansList': 'Beans list',
        'beansStatistics': 'Beans statistics',
        'aboutThisApp': 'About this App',
        'developer': 'Developer'
      };
      this.translations['de'] = this.translations['en']; // Fallback to English
    }
  }

  setLanguage(lang: string): void {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('beans-app-language', lang);
  this.languageSubject.next(lang);
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /** Map app language to a locale string for date formatting (fallbacks if needed). */
  getCurrentLocale(): string {
    switch (this.currentLanguage) {
      case 'de':
        return 'de-DE';
      case 'en':
      default:
        return 'en-US';
    }
  }

  translate(key: string): string {
    const translation = this.translations[this.currentLanguage]?.[key];
    return translation || key;
  }

  getAvailableLanguages(): string[] {
    return Object.keys(this.translations);
  }
}
