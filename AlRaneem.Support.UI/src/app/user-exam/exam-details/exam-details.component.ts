import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule instead of HttpClient
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgIf, AsyncPipe, DatePipe, NgFor, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { DemoMaterialModule } from '../../demo-material-module';
import { UtcToLocalPipe } from '../../utc-to-local.pipe';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-exam-details',
  standalone: true,
  imports: [
    HttpClientModule,  // Corrected this to HttpClientModule
    MatCardModule,
    MatPaginatorModule,
    MatIconModule,
    NgIf,
    NgFor,
    NgClass,
    AsyncPipe,
    DatePipe,
    DemoMaterialModule,
    UtcToLocalPipe,
    TranslatePipe
  ],
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.scss']
})
export class ExamDetailsComponent implements OnInit {
  exam: any | null = null;
  examId: string | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.examId = params.get('examId');
      if (this.examId) {
        this.viewExamDetails(this.examId);
      }
    });
    
  }

  viewExamDetails(examId: string) {
    const url = `Exam/viewExamDetails?examId=${examId}`;
    this.http.get<any>(url).subscribe(response => {
      this.exam = response.Data;
      console.log(this.exam)
    });
  }

}
