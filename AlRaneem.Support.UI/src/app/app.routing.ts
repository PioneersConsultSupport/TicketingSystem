import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { TicketsComponent } from './tickets/tickets.component';
import { MsalGuard } from '@azure/msal-angular';
import { AdminPanelComponent } from './Admin Panel/admin-panel.component';

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
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
      },
    ],
  },
];
