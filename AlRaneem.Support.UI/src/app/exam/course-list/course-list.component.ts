import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';  // Import Router
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../demo-material-module';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, DemoMaterialModule, TranslatePipe],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  courses: any[] = [];
  apiUrl = 'Course/getAll';

  constructor(private http: HttpClient, private router: Router) { }  // Inject Router

  ngOnInit(): void {
    this.getCourses().subscribe((response: any) => {
      this.courses = response.Data || [];
      console.log(this.courses);
    });
  }

  getCourses(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Method to navigate to the unit-list component
  navigateToUnits(courseId: number): void {
    this.router.navigate([`exam/${courseId}/units`]);  // Navigates to unit-list with courseId
  }
}
