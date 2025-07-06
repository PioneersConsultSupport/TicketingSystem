import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../../services/authService';
import { TranslationService } from '../../../services/translation.service';
import { MsalService } from '@azure/msal-angular';
import { DemoMaterialModule } from '../../../demo-material-module';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { environment } from 'src/app/environments/environment';
import { MatSelect } from '@angular/material/select';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-header-support',
  templateUrl: './header-support.component.html',
  styleUrls: ['./header-support.component.scss'],
})
export class AppHeaderSupportComponent implements OnInit {
  languageSelect?: string;

  constructor(
    private authService: AuthService,
    private translationService: TranslationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const lang = localStorage.getItem('selected-lang') ?? '';
    if (lang && lang != 'null') {
      this.languageSelect = lang;
    } else {
      this.languageSelect = 'en';
    }
    this.changeLanguage(this.languageSelect);
  }

  logout() {
    const popup = window.open(
      'https://login.microsoftonline.com/' +
        environment.tenantId +
        '/oauth2/v2.0/logout',
      'Azure Logout',
      'width=600,height=600'
    );

    const interval = setInterval(() => {
      if (popup?.closed) {
        clearInterval(interval);
        this.authService.clearToken();
        this.router.navigate(['']);
      }
    }, 1000);
  }
  isLoggedIn() {
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
