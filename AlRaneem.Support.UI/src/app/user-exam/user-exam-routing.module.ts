import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamListComponent } from './exam-list/exam-list.component';
import { SessionComponent } from './session/session.component';
import { ExamDetailsComponent } from './exam-details/exam-details.component';

export const UserExamsRoutes: Routes = [
  { path: '', component: ExamListComponent },
  { path: ':examId/session', component: SessionComponent },
  { path: ':examId/details', component: ExamDetailsComponent },
];
