import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { AuthService } from 'src/app/services/auth-service';
import { UserService } from 'src/app/services/user-service';
import { UserRole } from 'src/app/models/user-role';
import { UserRoles } from 'src/app/enums/user-roles';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-header-support',
  templateUrl: './header-support.component.html',
  styleUrls: ['./header-support.component.scss'],
})
export class AppHeaderSupportComponent implements OnInit {
  languageSelect?: string;
  currentUser?: UserRole;
  userRoles = UserRoles;

  constructor(
    private authService: AuthService,
    private translationService: TranslationService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const lang = localStorage.getItem('selected-lang') ?? '';
    if (lang && lang != 'null') {
      this.languageSelect = lang;
    } else {
      this.languageSelect = 'en';
    }
    this.changeLanguage(this.languageSelect);
    this.getCurrentUserAsync();
  }

  logout() {
    const popup = window.open(
      'https://login.microsoftonline.com/' +
        environment.tenantId +
        '/oauth2/v2.0/logout',
      'Azure Logout',
      'width=600,height=600',
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
  async getCurrentUserAsync() {
    this.currentUser = await this.userService.getCurrentUserAsync();
    debugger;
  }
  getRoleName(roleId: number): string {
    return UserRoles[roleId] ?? 'Unknown';
  }
}
