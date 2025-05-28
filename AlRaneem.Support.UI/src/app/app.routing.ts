import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { TicketsComponent } from './tickets/tickets.component';
import { MsalGuard } from '@azure/msal-angular';
import { AdminPanelComponent } from './Admin Panel/admin-panel.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: 'tickets',
        pathMatch: 'full',
      },
      {
        path: 'tickets',
        canActivate: [MsalGuard],
        component: TicketsComponent,
      },
      {
        path: 'admin-panel',
        canActivate: [MsalGuard],
        component: AdminPanelComponent,
      },
      { 
        path: 'unauthorized',
        canActivate: [MsalGuard],
        component: UnauthorizedComponent
      }
    ],
  },
];
