import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketHistory } from '../models/ticket-history';

@Injectable({
  providedIn: 'root',
})
export class TicketHistoryService {
  baseUrl = 'TicketHistory';

  constructor(private http: HttpClient) {}

  getTicketHistoryByTicketId(ticketId: number): Observable<TicketHistory[]> {
    return this.http.get<TicketHistory[]>(`${this.baseUrl}/ticket/${ticketId}`);
  }

  saveHistory(ticketHistory: TicketHistory): Observable<TicketHistory> {
    return this.http.post<TicketHistory>(
      `${this.baseUrl}/saveHistory`,
      ticketHistory,
    );
  }
}
