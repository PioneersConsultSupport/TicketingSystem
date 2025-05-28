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
import { RouterModule } from '@angular/router';
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
    private msalService: MsalService
  ) {}

  ngOnInit(): void {
    const lang = localStorage.getItem('selected-lang') ?? "";
    if (lang != 'null') {
      this.languageSelect = lang;
    } else {
      this.languageSelect = 'en';
    }
    this.changeLanguage(this.languageSelect);
  }

  logout() {
    localStorage.removeItem('userRole');
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: environment.redirectUri,
    });
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
