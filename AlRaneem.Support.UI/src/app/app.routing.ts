import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
//import { RegisterComponent } from './register/register.component';
//import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { TicketsComponent } from './tickets/tickets.component';
import { MsalGuard } from '@azure/msal-angular';


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
        component: TicketsComponent
      }

      //,
      //{
      //  path: '',
      //  loadChildren:
      //    () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
      //},
      //{
      //  path: 'dashboard',
      //  canActivate: [authGuard],
      //  loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      //},
      //{
      //  path: 'register', component: RegisterComponent},
      //{
      //  path: 'login', component: LoginComponent
      //},
      ,{
        path: 'user',
        loadChildren:
          () => import('./user/user.module').then(m => m.UserModule)
      }
      ,
      //{
      //  path: 'exam',
      //  loadChildren:
      //    () => import('./exam/exam.module').then(m => m.ExamModule)
      //},
      //{
      //  path: 'explore',
      //  loadChildren:
      //    () => import('./explore/explore.module').then(m => m.ExploreModule)
      //},
      //{
      //  path: 'courses',
      //  loadChildren:
      //    () => import('./course/course.module').then(m => m.CourseModule)
      //},
      //{
      //  path: 'exams',
      //  loadChildren:
      //    () => import('./user-exam/user-exam.module').then(m => m.UserExamModule)
      //},
    ]
  }
];
