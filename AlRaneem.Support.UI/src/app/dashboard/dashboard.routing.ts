import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { DashboardComponent } from './dashboard.component';

export const DashboardRoutes: Routes = [{
  path: '',
  component: DashboardComponent,
  canActivate: [MsalGuard]
}];
