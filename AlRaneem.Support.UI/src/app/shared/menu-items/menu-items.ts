import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  authenticated: boolean;
}

const MENUITEMS: Menu[] = [
  //{ state: '/user/register', name: 'REGISTER', type: 'link', icon: 'app_registration', authenticated: false },
  { state: '/user/login', name: 'LOGIN', type: 'link', icon: 'login', authenticated: false },
  { state: '/tickets', name: 'Tickets', type: 'link', icon: 'support_agent', authenticated: true },
  //{ state: '/courses', name: 'COURSES', type: 'link', icon: 'local_library', authenticated: true },
  //{ state: '/exams', name: 'EXAMS', type: 'link', icon: 'bookmark_added', authenticated: true },
  //{ state: '/dashboard', name: 'DASHBOARD', type: 'link', icon: 'av_timer', authenticated: true }
];

@Injectable()
export class MenuItems {
  getAuthenticatedMenuitem(): Menu[] {
    return MENUITEMS.filter(item => item.authenticated);
  }

  getNotAuthenticatedMenuitem(): Menu[] {
    return MENUITEMS.filter(item => !item.authenticated);
  }
}
