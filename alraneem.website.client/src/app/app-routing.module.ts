import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SolutionComponent } from './components/solution/solution.component';
import { SolutionDetailsComponent } from './components/solution/solution-details/solution-details.component';
import { TeamsComponent } from './components/teams/teams.component';
import { TermsComponent } from './components/terms/terms.component';
import { WrapeComponent } from './components/wrape-component/wrape.component';
import { authGuard } from './guards/auth.guard';
import { FullComponent } from './layout/full/full.component';
import { TicketsComponent } from './components/help-center/tickets/tickets.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AdminPanelComponent } from './components/help-center/Admin Panel/admin-panel.component';
import { CategoryComponent } from './components/help-center/category-management/category/category.component';
import { SubcategoryComponent } from './components/help-center/category-management/subcategory/subcategory.component';

const routes: Routes = [
  {
    path: 'support',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: 'tickets',
        pathMatch: 'full',
      },
      {
        path: 'tickets',
        component: TicketsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'admin-panel',
        component: AdminPanelComponent,
        canActivate: [authGuard],
      },
      {
        path: 'category-management',
        component: CategoryComponent,
        canActivate: [authGuard],
      },
      {
        path: 'category-management/subcategory',
        component: SubcategoryComponent,
        canActivate: [authGuard],
      },
      {
        path: 'unauthorized',
        canActivate: [authGuard],
        component: UnauthorizedComponent,
      },
    ],
  },
  {
    path: '',
    component: WrapeComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'solutions',
        component: SolutionComponent,
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'solutions/detail/:id',
        component: SolutionDetailsComponent,
      },
      {
        path: 'team',
        component: TeamsComponent,
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'terms',
        component: TermsComponent,
        runGuardsAndResolvers: 'always',
      },
    ],
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
