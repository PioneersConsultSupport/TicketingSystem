//import { Injectable } from '@angular/core';
//import { HttpClient, HttpParams } from '@angular/common/http';
//import { Observable } from 'rxjs';
//import { ApiResponse } from '../../models/api-base-response.model';

//@Injectable({
//  providedIn: 'root', // This makes the service globally available.
//})
//export class ticketService {
//  private apiUrl = 'Reviewer'; // Replace with your API base URL.

//  constructor(private http: HttpClient) { }

//  getRejectionReasons(): Observable<any> {
//    const endpoint = `${this.apiUrl
//      }/ getRejectionReasons`; // Full API URL
//    return this.http.get(endpoint);
//  }

//  getUnloggedQuestions(request: getUnloggedQuestionsRequest): Observable<ApiResponse<UnvalidatedQuestionResponse[]>> {
//    const params = new HttpParams()
//      .set('courseNumber', request.courseNumber.toString())
//      .set('unitNumber', request.UnitNumber.toString())
//      .set('chapterNumber', request.chapterNumber.toString());

//    return this.http.get<ApiResponse<UnvalidatedQuestionResponse[]>>(`${this.apiUrl}/ getUnloggedQuestions`, { params });
//  }

//  insertReviewerLog(request: reviewerLogRequest): Observable<any> {
//    const endpoint = `${this.apiUrl}/ insertReviewerLog`; // API endpoint
//    return this.http.post(endpoint, request);
//  }
//}
