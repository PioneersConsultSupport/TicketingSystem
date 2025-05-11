import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/authService';
import { TranslationService } from '../../../services/translation.service';

import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-items/menu-items';
import { DemoMaterialModule } from '../../../demo-material-module';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
  standalone: true,
  imports: [DemoMaterialModule, NgFor, NgIf, RouterModule, CommonModule, MatIconModule, TranslatePipe],
})
export class AppHeaderComponent implements AfterViewInit {
  @ViewChild('languageSelect', { static: true }) languageSelect!: ElementRef<HTMLSelectElement>;

  constructor(private authService: AuthService, private translationService: TranslationService) {
    
  }
    ngAfterViewInit(): void {
      const lang = localStorage.getItem('selected-lang');
      if (lang) {
        this.languageSelect.nativeElement.value = lang;
      }
      this.changeLanguage(lang);
    }

  onSignOut(): void {
    this.authService.logout();
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  changeLanguageEvent(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement.value;
    this.changeLanguage(lang);
  }
  changeLanguage(lang: any) {
    this.translationService.setLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}
