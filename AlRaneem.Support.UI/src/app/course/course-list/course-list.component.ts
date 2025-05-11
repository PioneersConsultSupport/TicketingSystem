import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../demo-material-module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, DemoMaterialModule, TranslatePipe],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'] // Fixed typo (styleUrls)
})
export class CourseListComponent implements OnInit {
  favoriteCourses: any[] = [];
  getAllApiUrl = 'Course/getFavorite';
  removeFromFavoriteApiUrl = 'Course/removeFromFavorite'; // Added missing API URL

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getCourses().subscribe(
      (response: any) => {
        this.favoriteCourses = response.Data || [];
      },
      (error) => {
        console.error('Error fetching favorite courses:', error);
        this.snackBar.open('Failed to load favorite courses!', 'Close', {
          duration: 6000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  getCourses(): Observable<any> {
    return this.http.get<any>(this.getAllApiUrl);
  }

  removeFromFavorites(courseId: string): void {
    const url = `${this.removeFromFavoriteApiUrl}?courseId=${courseId}&userId=user123`;

    this.http.get<any>(url).subscribe(
      (response: any) => {
        if (response.IsSuccess) {
          // Remove the course from the favoriteCourses array
          this.favoriteCourses = this.favoriteCourses.filter(
            (course) => course.course.id !== courseId
          );
          this.snackBar.open('Course removed from favorites successfully!', 'Close', {
            duration: 6000,
            panelClass: ['success-snackbar']
          });
        } else {
          this.snackBar.open('Failed to remove course from favorites!', 'Close', {
            duration: 6000,
            panelClass: ['error-snackbar']
          });
        }
      },
      (error) => {
        console.error('Error removing favorite:', error);
        this.snackBar.open('Error occurred while removing the course', 'Close', {
          duration: 6000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  // Navigate to the unit-list component
  navigateToUnits(courseId: string): void {
    this.router.navigate([`courses/${courseId}/units`]);
  }
}
