import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from 'src/app/models/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  baseUrl = 'Comment';

  constructor(private http: HttpClient) {}

  getCommentsByTicketId(ticketId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/ticket/${ticketId}`);
  }

  sendComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/sendComment`, comment);
  }
}
