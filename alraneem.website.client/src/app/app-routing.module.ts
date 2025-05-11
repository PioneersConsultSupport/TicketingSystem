import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SolutionComponent } from './components/solution/solution.component';
import { SolutionDetailsComponent } from './components/solution/solution-details/solution-details.component';
import { TeamsComponent } from './components/teams/teams.component';
import { TermsComponent } from './components/terms/terms.component';1

const routes: Routes = [
  { path: 'home', component: HomeComponent, runGuardsAndResolvers: 'always' },
  {
    path: 'solutions',
    component: SolutionComponent,
    runGuardsAndResolvers: 'always',
  },
  { path: 'solutions/detail/:id', component: SolutionDetailsComponent },
  { path: 'team', component: TeamsComponent, runGuardsAndResolvers: 'always' },
  { path: 'terms', component: TermsComponent, runGuardsAndResolvers: 'always' },
  { path: '**', redirectTo: 'home', pathMatch:'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
