import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DemoMaterialModule } from '../../demo-material-module';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [CommonModule, DemoMaterialModule, TranslatePipe],
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss']
})
export class UnitListComponent {
  courseId: number | null = null;
  units: any[] = [];  // Store units received from the API
  apiUrl = 'Unit/getUnitsByCourseId';  // Base API URL
  questionApiUrl = 'Question/generateAIQuestion';  // Question API URL

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Retrieve courseId from the route parameters
    this.route.paramMap.subscribe(params => {
      this.courseId = Number(params.get('courseId'));
      if (this.courseId) {
        this.getUnitsByCourseId(this.courseId).subscribe((response: any) => {
          this.units = response.Data || [];  // Assume the API returns { Data: [...] }
          console.log(this.units);  // Debugging
        });
      }
    });
  }

  // Method to call the API to get units by courseId
  getUnitsByCourseId(courseId: number): Observable<any> {
    const url = `${this.apiUrl}?courseId=${courseId}`;  // Append courseId to URL
    return this.http.get<any>(url);
  }

  // Method to call the generateAIQuestion API and navigate to QuestionComponent
  startExam(unitId: number): void {
    // Redirect to QuestionComponent
    this.router.navigate(['exam/question'], { queryParams: { courseId: this.courseId, unitId: unitId } });
  }
}
