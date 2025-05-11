import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../demo-material-module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/courseService';

@Component({
  selector: 'app-explore-list',
  standalone: true,
  imports: [CommonModule, DemoMaterialModule, TranslatePipe, FormsModule],
  templateUrl: './explore-list.component.html',
  styleUrls: ['./explore-list.component.scss']
})
export class ExploreListComponent implements OnInit {
  courses: any[] = [];
  getAllApiUrl = 'Course/getAll';
  searchApiUrl = 'Course/search';
  favoriteApiUrl = 'Course/favorite'; // Unified API for toggling favorites
  addToFavoriteApiUrl = 'Course/addToFavorite';
  removeFromFavoriteApiUrl = 'Course/removeFromFavorite';
  searchText: string = '';
  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar, private courseService: CourseService) {
  }

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.courseService.getCourses().subscribe(
      (response: any) => {
        this.courses = response.Data || [];
      },
      (error) => {
        console.error('Error fetching courses:', error);
        this.snackBar.open('Failed to load courses!', 'Close', {
          duration: 6000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  clearSearch() {
    this.searchText = '';
    this.onSearch(); 
  }

  onSearch(): void {
    if (this.searchText.length == 0) {
      this.fetchCourses();
    }
    else
    {
      this.courseService.searchCourses(this.searchText).subscribe(
        (response: any) => {
          this.courses = response.Data || [];
        },
        (error) => {
          console.error('Error fetching courses:', error);
          this.snackBar.open('Failed to load courses!', 'Close', {
            duration: 6000,
            panelClass: ['error-snackbar']
          });
        }
      );
    }
  }
  toggleFavorite(courseId: string, isFavorite: boolean): void {
    const url = isFavorite
      ? `${this.removeFromFavoriteApiUrl}?courseId=${courseId}&userId=user123` // Ensure userId is included
      : `${this.addToFavoriteApiUrl}?courseId=${courseId}&userId=user123`;

    console.log('URL for favorite toggle:', url);

    // Use HTTP GET for both add and remove favorite actions
    this.http.get<any>(url).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.IsSuccess) {
          const course = this.courses.find(c => c.id === courseId);
          if (course) {
            course.isFavorite = !isFavorite; // Update favorite status locally
          }
          this.snackBar.open(
            isFavorite
              ? 'Removed from your courses successfully!'
              : 'Added to your courses successfully!',
            'Close',
            { duration: 6000, panelClass: ['success-snackbar'] }
          );
        } else {
          this.snackBar.open('Something went wrong!', 'Close', {
            duration: 6000,
            panelClass: ['error-snackbar'],
          });
        }
      },
      (error) => {
        console.error('Error:', error);
        this.snackBar.open('Error occurred while processing your request', 'Close', {
          duration: 6000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }


  // Navigate to the unit-list page
  navigateToUnits(courseId: string): void {
    this.router.navigate([`explore/${courseId}/units`]);
  }
}



