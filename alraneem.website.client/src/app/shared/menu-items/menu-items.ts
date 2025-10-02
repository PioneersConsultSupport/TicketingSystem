import { Injectable } from '@angular/core';
import { UserRoles } from '../../Enums/user-roles';
import { UserService } from '../../Services/UserService';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  authenticated: boolean;
}

@Injectable({ providedIn: 'root' })
export class MenuItems {
  MENUITEMS: Menu[] = [
    {
      state: '/support/admin-panel',
      name: 'admin_panel',
      type: 'link',
      icon: 'admin_panel_settings',
      authenticated: false,
    },
    {
      state: '/support/tickets',
      name: 'Tickets',
      type: 'link',
      icon: 'confirmation_number',
      authenticated: false,
    },
    {
      state: '/support/category-management',
      name: 'category_management',
      type: 'link',
      icon: 'category',
      authenticated: false,
    },
  ];

  constructor() {}

  getMenuitemSync(userRole: UserRoles): Menu[] {
    this.MENUITEMS.forEach((item) => {
      switch (item.state) {
        case '/support/admin-panel':
        case '/support/category-management':
          item.authenticated = userRole === UserRoles.Admin;
          break;
        case '/support/tickets':
          item.authenticated = userRole != null;
          break;
        default:
          item.authenticated = false;
      }
    });
    return this.MENUITEMS.filter((item) => item.authenticated);
  }
}
