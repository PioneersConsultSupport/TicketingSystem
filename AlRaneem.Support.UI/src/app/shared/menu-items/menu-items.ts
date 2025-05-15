import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  authenticated: boolean;
}

const MENUITEMS: Menu[] = [
  { state: '/admin-panel', name: 'Admin Panel', type: 'link', icon: 'support_agent', authenticated: true },
  { state: '/tickets', name: 'Tickets', type: 'link', icon: 'support_agent', authenticated: true },
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
