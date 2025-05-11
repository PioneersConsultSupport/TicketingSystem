import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExploreRoutes } from './explore-routing.module';
import { RouterModule } from '@angular/router';
import { AddExamDialogComponent } from './add-exam-dialog/add-exam-dialog.component';
@NgModule({
  declarations: [
    // other components
  ],
  imports: [
    CommonModule, AddExamDialogComponent ,
    RouterModule.forChild(ExploreRoutes),
  ]
})
export class ExploreModule { }
