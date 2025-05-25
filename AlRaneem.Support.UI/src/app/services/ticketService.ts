import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ticket } from '../models/ticket';

@Injectable({
  providedIn: 'root'
})

export class ticketService {

  baseUrl = "Ticket";
  constructor(private http: HttpClient) { }

  addTicket(ticket: Ticket){
      return this.http.post<Ticket>(this.baseUrl, ticket);
  }

  updateTicket(ticket: Ticket){
      return this.http.put<Ticket>(this.baseUrl, ticket);
  }

  deleteTicket(ticket: Ticket){
      return this.http.post(this.baseUrl + '/Delete', ticket);
  }

  getAllTickets(){
      return this.http.get<any>(this.baseUrl);
  }
}
