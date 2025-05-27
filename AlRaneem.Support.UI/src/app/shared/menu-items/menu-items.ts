import { Injectable } from '@angular/core';
import { UserService } from '../../services/UserService';
import { UserRoles } from '../../Enums/user-roles';

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
    { state: '/admin-panel', name: 'admin_panel', type: 'link', icon: 'support_agent', authenticated: true },
    { state: '/tickets', name: 'Tickets', type: 'link', icon: 'support_agent', authenticated: true },
  ];

  constructor(private userService: UserService){
  }

  async getMenuitem() {
    const userRole = await this.userService.getUserRole() ?? 0;
    this.MENUITEMS[0].authenticated = +userRole == UserRoles.Admin ? true : false;
    this.MENUITEMS[1].authenticated = +userRole != null || +userRole != undefined ? true : false;
    return this.MENUITEMS.filter(item => item.authenticated);
  }
}
