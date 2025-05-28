import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SolutionComponent } from './components/solution/solution.component';
import { SolutionDetailsComponent } from './components/solution/solution-details/solution-details.component';
import { TeamsComponent } from './components/teams/teams.component';
import { TermsComponent } from './components/terms/terms.component';
import { FullComponent } from './layout/full/full.component';
import { TicketsComponent } from './tickets/tickets.component';
import { AdminPanelComponent } from './components/Admin Panel/admin-panel.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { MsalGuard } from '@azure/msal-angular';
import { WrapeComponent } from './components/wrape-component/wrape.component';
1;

const routes: Routes = [
  {
    path: 'page',
    component: WrapeComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'solutions',
        component: SolutionComponent,
        runGuardsAndResolvers: 'always'
      },
      { 
        path: 'solutions/detail/:id',
        component: SolutionDetailsComponent
      },
      {
        path: 'team',
        component: TeamsComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'terms',
        component: TermsComponent,
        runGuardsAndResolvers: 'always'
      },
    ],
  },
  {
    path: 'support',
    component: FullComponent,
    children: [
      {
        path: 'support',
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
        component: UnauthorizedComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'page/home', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
