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

@Injectable()
export class MenuItems {
  
  MENUITEMS: Menu[] = [
    { state: '/support/admin-panel', name: 'admin_panel', type: 'link', icon: 'admin_panel_settings', authenticated: true },
    { state: '/support/tickets', name: 'Tickets', type: 'link', icon: 'confirmation_number', authenticated: true },
    { state: '/support/category-management', name: 'category_management', type: 'link', icon: 'category', authenticated: true },
  ];

  constructor(private userService: UserService){
  }

  async getMenuitem() {
    const userRole = await this.userService.getUserRole() ?? 0;
    this.MENUITEMS[0].authenticated = +userRole == UserRoles.Admin ? true : false;
    this.MENUITEMS[1].authenticated = +userRole != null || +userRole != undefined ? true : false;
    this.MENUITEMS[2].authenticated = +userRole == UserRoles.Admin ? true : false;
    return this.MENUITEMS.filter(item => item.authenticated);
  }
}
