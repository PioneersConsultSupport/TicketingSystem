import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DemoMaterialModule } from '../../demo-material-module';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [CommonModule, DemoMaterialModule, TranslatePipe],
  templateUrl: './unit-list.component.html',
  styleUrl: './unit-list.component.scss'
})
export class UnitListComponent {
  courseId: string | null = null;
  units: any[] = [];  // Store units received from the API
  apiUrl = 'Unit/getUnitsByCourseId';  // Base API URL
  examApiUrl = 'Exam/create';  // Exam create API URL
  questionApiUrl = 'Question/generateAIQuestion';  // Question API URL

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router,
    public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // Retrieve courseId from the route parameters
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('courseId');
      if (this.courseId) {
        this.getUnitsByCourseId(this.courseId).subscribe((response: any) => {
          this.units = response.Data || [];  // Assume the API returns { Data: [...] }
          console.log(this.units);  // Debugging
        });
      }
    });
  }
  //openDialog(unitId: string): void {
  //  const dialogRef = this.dialog.open(AddExamDialogComponent, {
  //    width: '250px',
  //    data: { examName: '' }  // Passing empty initial data
  //  });

  //  dialogRef.afterClosed().subscribe(result => {
  //    if (result) {
  //      // Assuming you have the userId stored in localStorage or elsewhere

  //      // Call the API to create the new exam with the entered examName, userId, and unitId
  //      this.createExam(result, null, unitId).subscribe(
  //        response => {
  //          if (response.IsSuccess) {
  //            this.snackBar.open('Exam created successfully!', 'Close', {
  //              duration: 6000,  // Automatically close after 3 seconds
  //              panelClass: ['success-snackbar']  // You can style this with a success color
  //            });
  //          } else {
  //            this.snackBar.open('Failed to create exam. Please try again.', 'Close', {
  //              duration: 6000,
  //              panelClass: ['error-snackbar']  // You can style this with an error color
  //            });
  //          }
  //        },
  //        error => {
  //          this.snackBar.open('Failed to create exam. Please try again.', 'Close', {
  //            duration: 6000,
  //            panelClass: ['error-snackbar']  // You can style this with an error color
  //          });
  //        }
  //      );
  //    }
  //  });
  //}

  createExam(examName: string, userId: string | null, unitId: string): Observable<any> {
    const payload = {
      name: examName,
      userId: userId,
      unitId: unitId
    };
    return this.http.post<any>(this.examApiUrl, payload);
  }
  // Method to call the API to get units by courseId
  getUnitsByCourseId(courseId: string): Observable<any> {
    const url = `${this.apiUrl}?courseId=${courseId}`;  // Append courseId to URL
    return this.http.get<any>(url);
  }

  // Method to call the generateAIQuestion API and navigate to QuestionComponent
  startExam(unitId: number): void {
    // Redirect to QuestionComponent
    this.router.navigate(['exam/question'], { queryParams: { courseId: this.courseId, unitId: unitId } });
  }
}
