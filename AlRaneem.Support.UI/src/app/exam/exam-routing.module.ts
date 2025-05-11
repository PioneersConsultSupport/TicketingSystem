import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseListComponent } from './course-list/course-list.component';
import { UnitListComponent } from './unit-list/unit-list.component';
import { QuestionComponent } from './question/question.component';


export const ExamRoutes: Routes = [
  { path: 'list', component: CourseListComponent },
  { path: ':courseId/units', component: UnitListComponent },
  { path: 'question', component: QuestionComponent }
];
