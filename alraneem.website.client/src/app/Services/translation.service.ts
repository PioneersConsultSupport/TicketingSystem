import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private language = new BehaviorSubject<string>('en');
  private translations: { [key: string]: string } = {};

  constructor(private http: HttpClient) {
    this.loadTranslations(this.language.getValue());
  }

  setLanguage(lang: string) {
    localStorage.setItem('selected-lang', lang);
    this.language.next(lang);
    this.loadTranslations(lang);
  }

  private loadTranslations(lang: string) {
    this.http.get(`assets/i18n/${lang}.json`).subscribe(
      (translations: any) => {
        this.translations = translations;
      },
      (error) =>
        console.error(`Could not load translations for ${lang}`, error),
    );
  }

  getTranslation(key: string): string {
    return this.translations[key] || key;
  }

  getDirection(): 'ltr' | 'rtl' {
    return this.language.getValue() === 'ar' ? 'rtl' : 'ltr';
  }
}
