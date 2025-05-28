import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { filter, take } from 'rxjs';
import { ticketService } from '../services/ticketService';
import { Ticket } from '../models/ticket';
import { Lookup } from '../models/lookup';
import { MatSort } from '@angular/material/sort';
import { UserRoles } from '../Enums/user-roles';
import { UserRole } from '../models/user-role';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {
  dataSource!: MatTableDataSource<Ticket>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userRoleOjbect!: UserRole;
  displayedColumns: string[] = [];
  ticketList: Ticket[] = [];
  lookupList: Lookup[] = [];
  categoryList: { key: string; value: number }[] = [];
  statusList: { key: string; value: number }[] = [];
  assignedToList: { key: string; value: number }[] = [];
  filterValues = {
    status: '',
    category: '',
    assignedToId: '',
    referenceNumber: '',
  };

  constructor(
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private ticketService: ticketService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        take(1)
      )
      .subscribe(() => {
        const accounts = this.msalService.instance.getAllAccounts();
        if (accounts.length > 0) {
          this.msalService.instance.setActiveAccount(accounts[0]);
        }
      });
    this.ticketService.getAllTickets().subscribe((res) => {
      this.userRoleOjbect = res.userRole;
      this.displayedColumns = [
        'referenceNumber',
        'title',
        'category',
        'status',
        'assignedTo',
        'edit',
        'view',
      ];

      if (this.userRoleOjbect.userRoleId == UserRoles.Client) {
        this.displayedColumns = this.displayedColumns.filter(
          (x) => x != 'edit' && x != 'view'
        );
      } else if (this.userRoleOjbect.userRoleId == UserRoles.Employee) {
        this.displayedColumns = this.displayedColumns.filter(
          (x) => x != 'view' && x != 'assignedTo'
        );
      }

      this.ticketList = res.ticketList;
      this.dataSource = new MatTableDataSource(this.ticketList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data, filter) => {
        const searchTerms = JSON.parse(filter);
        return (
          (searchTerms.status ? data.statusId === searchTerms.status : true) &&
          (+searchTerms.referenceNumber
            ? data.id === +searchTerms.referenceNumber
            : true) &&
          (searchTerms.category
            ? data.categoryId === searchTerms.category
            : true) &&
          (searchTerms.assignedToId
            ? data.assignedToId === searchTerms.assignedToId
            : true)
        );
      };
      this.lookupList = res.lookups;

      this.categoryList = this.getLookupByType('Category');
      this.statusList = this.getLookupByType('TicketStatus');
      this.assignedToList = res.userRoleByRole?.map((x: any) => ({
        key: x.userName,
        value: x.id,
      }));
    });
  }

  applyFilter() {
    this.dataSource.filter = JSON.stringify(this.filterValues);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getLookupByType(type: string) {
    return this.lookupList
      .filter((x) => type == x.type)
      .map((x) => ({ key: x.name, value: x.id }));
  }

  openTicketDialog(): void {
    const dialogRef = this.dialog.open(TicketDialogComponent, {
      width: '500px',
      direction: document.documentElement.dir == 'ltr' ? 'ltr' : 'rtl',
      data: {
        title: 'create_new_ticket',
        lookups: this.lookupList,
        assignedToList: this.assignedToList,
        userRole: this.userRoleOjbect,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        this.ticketService.addTicket(result.data).subscribe((res: Ticket) => {
          this.ticketList.push(res);
          this.dataSource.data = [...this.ticketList];
        });
      },
      error: (error) => console.log(error),
      complete: () => this.dataSource._updateChangeSubscription(),
    });
  }

  openEditTicketDialog(ticket: any): void {
    const dialogRef = this.dialog.open(TicketDialogComponent, {
      width: '500px',
      direction: document.documentElement.dir == 'ltr' ? 'ltr' : 'rtl',
      data: {
        title: 'edit_ticket',
        ticket,
        lookups: this.lookupList,
        assignedToList: this.assignedToList,
        userRole: this.userRoleOjbect,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        this.ticketService
          .updateTicket(result.data)
          .subscribe((res: Ticket) => {
            let index = this.ticketList.findIndex((x) => x.id == res.id);
            this.ticketList[index] = res;
            this.dataSource.data = [...this.ticketList];
          });
      },
      error: (error) => console.log(error),
      complete: () => this.dataSource._updateChangeSubscription(),
    });
  }

  openViewTicketDialog(ticket: any): void {
    const dialogRef = this.dialog.open(TicketDialogComponent, {
      width: '500px',
      direction: document.documentElement.dir == 'ltr' ? 'ltr' : 'rtl',
      data: {
        title: 'view_ticket',
        ticket,
        lookups: this.lookupList,
        assignedToList: this.assignedToList,
        userRole: this.userRoleOjbect,
        isViewMode: true,
      },
    });
  }

  clearFilter(field: keyof typeof this.filterValues) {
    this.filterValues[field] = '';
    this.applyFilter();
  }
}
