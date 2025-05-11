import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExploreListComponent } from './explore-list/explore-list.component';
import { UnitListComponent } from './unit-list/unit-list.component';

export const ExploreRoutes: Routes = [
  { path: '', component: ExploreListComponent },
  { path: ':courseId/units', component: UnitListComponent },
];
