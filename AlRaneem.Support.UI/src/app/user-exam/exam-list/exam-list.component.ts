import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule instead of HttpClient
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgIf, AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DemoMaterialModule } from '../../demo-material-module';
import { UtcToLocalPipe } from '../../utc-to-local.pipe';
import { ExamSearchCriteria } from '../../../models/exam/ExamSearchCriteria';
import { MatSelectModule } from '@angular/material/select';
import { Lookup } from '../../../models/lookup';
import { FormsModule, NgModel } from '@angular/forms';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [
    HttpClientModule,  // Corrected this to HttpClientModule
    MatCardModule,
    MatPaginatorModule,
    MatIconModule,
    NgIf,
    NgFor,
    FormsModule,
    MatSelectModule,
    AsyncPipe,
    DatePipe,
    DemoMaterialModule,
    UtcToLocalPipe,
    TranslatePipe
  ],
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.scss']
})
export class ExamListComponent implements OnInit {
  exams: any[] = [];
  criteria: ExamSearchCriteria = new ExamSearchCriteria();
  totalCount: number = 0;
  courseList: Lookup<any>[] = [];
  unitList: Lookup<any>[] = [];
  examStatuses = [
    { value: 'notStarted', label: 'EXAM_STATUS_NOT_STARTED' },
    { value: 'started', label: 'EXAM_STATUS_STARTED' },
    { value: 'finished', label: 'EXAM_STATUS_FINISHED' }
  ];



  //selectedCourse: any | null = null;
  constructor(private http: HttpClient, private router: Router) {
    this.criteria.currentPage = 1;
    this.criteria.pageSize = 10;
    //this.criteria.unitIds = ['guid1', 'guid2'];
  }

  ngOnInit() {
    this.getExams(this.criteria);
    this.getCourses();
  }
  search() {
    this.getExams(this.criteria);
  }
  onExamStatusChange(status: string): void {
    this.criteria.examStatus = status;
    // Call a method to filter exams based on the selected status
    this.filterExamsByStatus(status);
  }

  filterExamsByStatus(status: string): void {
    // Implement filtering logic here based on the selected status
  }
  getExams(searchCriteria: ExamSearchCriteria) {
    let params = new HttpParams()
      .set('currentPage', searchCriteria.currentPage?.toString())
      .set('pageSize', searchCriteria.pageSize?.toString());

    if (searchCriteria.courseId) {
      params = params.append('courseId', searchCriteria.courseId?.toString());
    }
    if (searchCriteria.examStatus) {
      params = params.append('examStatus', searchCriteria.examStatus?.toString());
    }
    // Check if unitIds exists and is not empty before appending to params
    if (searchCriteria.unitIds && searchCriteria.unitIds.length > 0) {
      searchCriteria.unitIds.forEach(id => {
        params = params.append('unitIds', id);
      });
    }

    const url = `Exam/search`;
    this.http.get<any>(url, { params }).subscribe(response => {
      this.exams = response.Data.items;
      this.totalCount = response.Data.totalCount;
    });
  }

  onPageChange(event: PageEvent) {
    this.criteria.currentPage = event.pageIndex + 1; // Material paginator is 0-based
    this.criteria.pageSize = event.pageSize;
    this.getExams(this.criteria);
  }

  getCourses() {
    const url = `Lookup/courseLookup`;
    this.http.get<any>(url).subscribe(response => {
      this.courseList = response.Data;
    });
  }
  onCourseChange(courseId: any): void {
    if (courseId) {
      this.getUnits(courseId);
    }
  }
  getUnits(courseId: any): void {
    const url = `Lookup/unitLookup?courseId=${courseId}`;
    this.http.get<any>(url).subscribe(response => {
      this.unitList = response.Data;
      this.criteria.unitIds = [];
      this.criteria.unitIds = this.unitList.map(unit => unit.id);
    });
  }
  onUnitChange(unitId: any): void {
    if (unitId) {
      this.criteria.unitIds = [];
      this.criteria.unitIds.push(unitId);
    }
    else {
      if (this.unitList && this.unitList.length > 0) {
        this.criteria.unitIds = [];
        this.criteria.unitIds = this.unitList.map(unit => unit.id);
      }
    }
    console.log(this.criteria.unitIds)
  }
  navigateToSession(examId: string): void {
    const url = `Exam/start?examId=${examId}`;
    this.http.get<any>(url).subscribe(response => {
      if (response.Data) {
        this.router.navigate([`exams/${examId}/session`]);
      }
    });
  }
  viewExamDetails(examId: string): void {
    this.router.navigate([`exams/${examId}/details`]);
  }
}
