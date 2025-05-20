import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {
  filterForm: FormGroup;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'referenceNumber',
    'title',
    'status',
    'assignedTo',
    'category'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dummyEditTicket = {
    title: 'Sample Title',
    category: 'Finance & Operations',
    status: 'Open'
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      category: [''],
      assignedTo: [''],
      referenceNumber: [''],
    });
  }

  ngOnInit(): void {
    this.getTickets();
  }

  getTickets(): void {
    const params = new HttpParams({ fromObject: this.filterForm.value });
    this.http.get<any[]>('/api/tickets', { params }).subscribe((tickets) => {
      this.dataSource.data = tickets;
      this.dataSource.paginator = this.paginator;
    });
  }

  searchTickets(): void {
    this.getTickets();
  }

  openTicketDialog(): void {
    const dialogRef = this.dialog.open(TicketDialogComponent, {
      width: '500px',
      data: { title: 'Create New Ticket' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'create') {
        Swal.fire('Created!', 'The ticket has been created.', 'success');
        this.getTickets();
      }
    });
  }

  openEditTicketDialog(ticket: any): void {
    const dialogRef = this.dialog.open(TicketDialogComponent, {
      width: '500px',
      data: {
        title: 'Edit Ticket',
        ticket,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'edit') {
        Swal.fire('Updated!', 'The ticket has been updated.', 'success');
        this.getTickets();
      }
    });
  }
}
