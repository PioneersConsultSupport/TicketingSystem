import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  getAllApiUrl = 'Course/getAll';
  searchApiUrl = 'Course/search';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }


  searchCourses(prefixStr: string): Observable<any[]> {
    const url = `${this.searchApiUrl}?prefixStr=${encodeURIComponent(prefixStr)}`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }
  getCourses(): Observable<any> {
    return this.http.get<any>(this.getAllApiUrl);
  }
}
