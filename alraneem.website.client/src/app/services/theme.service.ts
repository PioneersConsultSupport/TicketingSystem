import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkMode = false;

  constructor() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setDarkMode(prefersDark);
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  toggleDarkMode() {
    this.setDarkMode(!this.darkMode);
  }

  setDarkMode(value: boolean) {
    this.darkMode = value;
    const body = document.body;
    if (value) {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
    } else {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
    }
  }
}
