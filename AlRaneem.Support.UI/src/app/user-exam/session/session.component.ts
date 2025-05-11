import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { DemoMaterialModule } from '../../demo-material-module';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { ConfirmDialogComponent } from '../../shared/confirm.dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [CommonModule, DemoMaterialModule, MatCardModule, MatRadioModule, MatButtonModule, FormsModule, TranslatePipe],
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit {
  examId: string | null = null;
  generatedCode: string | null = null;
  questionData: any = null;
  selectedChoiceId: string | null = null;
  errorMessage: string | null = null;
  submitted: boolean = false; 
  private readonly newProperty = "ARE_YOU_SURE_RESUME_LATER";
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    // Get examId from the URL
    this.route.paramMap.subscribe(params => {
      this.examId = params.get('examId');
      if (this.examId) {
        this.fetchQuestion(this.examId);
      }
    });
  }

  fetchQuestion(examId: string): void {
    // Call the API to get the question
    this.http.get<any>(`Exam/generateNewQuestion?examId=${examId}`)
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {

            this.questionData = response.Data;
            this.generatedCode = response.Data.generatedCode;
            this.resetForm();
          } else {
            this.errorMessage = 'Failed to load question.';
          }
        },
        error: (err) => {
          this.errorMessage = 'Failed to load question. Please try again later.';
          console.error(err);
        }
      });
  }
  resumeLater(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
       data: { message: this.newProperty }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['exams/']);
      }
    });
  }

  submitAnswer(): void {
    if (this.selectedChoiceId && this.questionData) {
      this.submitted = true; // Mark as submitted
      const url = "Exam/submitAnswer";
      // Create the payload
      const requestBody = {
        chapterId: this.questionData.chapterId,
        choiceId: this.selectedChoiceId,
        examId: this.examId,
        questionId: this.questionData.id
      };

      // Use POST instead of GET
      this.http.post<any>(url, requestBody).subscribe(
        (response: any) => {
          if (response.IsSuccess) {
            if (response.Data == true) {
              if (this.examId) {
                this.fetchQuestion(this.examId);
              }
            }
          } else {
            this.submitted = false;
            console.error('Failed to submit answer:', response.Errors);
          }
        },
        (error) => {
          console.error('Error submitting answer:', error);
        }
      );
    } else {
      alert('Please select an answer before submitting.');
    }
  }
  skip(): void {
      this.submitted = true; // Mark as submitted
      const url = "Exam/skipAnswer";
      // Create the payload
      const requestBody = {
        chapterId: this.questionData.chapterId,
        examId: this.examId,
        questionId: this.questionData.id
      };

      // Use POST instead of GET
      this.http.post<any>(url, requestBody).subscribe(
        (response: any) => {
          if (response.IsSuccess) {
            if (response.Data == true) {
              if (this.examId) {
                this.fetchQuestion(this.examId);
              }
            }
          } else {
            this.submitted = false;
            console.error('Failed to submit answer:', response.Errors);
          }
        },
        (error) => {
          console.error('Error submitting answer:', error);
        }
      );
  }

  resetForm(): void {
    this.selectedChoiceId = null;
    this.submitted = false;
  }
  viewExamDetails(): void {
    this.router.navigate([`exams/${this.examId}/details`]);
  }
}
