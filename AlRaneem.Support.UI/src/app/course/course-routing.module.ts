import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { UnitListComponent } from './unit-list/unit-list.component';
import { CourseListComponent } from './course-list/course-list.component';
import { UnitListComponent } from '../explore/unit-list/unit-list.component';

export const CourseRoutes: Routes = [
  { path: '', component: CourseListComponent },
  { path: ':courseId/units', component: UnitListComponent },
];
