import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TicketDialogComponent } from './ticket-dialog/ticket-dialog.component';
import { Ticket } from 'src/app/models/ticket';
import { TicketService } from 'src/app/Services/ticketService';
import { UserRoles } from 'src/app/Enums/user-roles';
import { ConfirmDialogService } from 'src/app/Services/confirm-dialog.service';
import { UserService } from 'src/app/Services/UserService';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from 'src/app/shared/pipes/translate.pipe';
import { FormsModule } from '@angular/forms';
import { CategoryType } from 'src/app/Enums/category-types';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/Services/category.Service';
import { Subcategory } from 'src/app/models/subcategory';
import { UserRole } from 'src/app/models/user-role';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    TranslatePipe,
    FormsModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {
  categories: Category[] = [];
  ticketStatus: Subcategory[] = [];
  displayedColumns: string[] = [];
  users: UserRole[] = [];

  isLoading = true;

  dataSource!: MatTableDataSource<Ticket>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterValues = {
    status: '',
    category: '',
    assignedToId: '',
    referenceNumber: '',
  };

  constructor(
    private ticketService: TicketService,
    private dialog: MatDialog,
    private userService: UserService,
    private confirmService: ConfirmDialogService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadTickets();
    this.displayColumns();
    this.loadFilterOptions();
  }

  loadTickets() {
    this.ticketService.getAllTickets().subscribe((res: Ticket[]) => {
      this.initDataSource(res);
      this.isLoading = false;
    });
  }

  initDataSource(res: Ticket[]) {
    this.dataSource = new MatTableDataSource(res);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data, filter) => {
      const searchTerms = JSON.parse(filter);

      return (
        (searchTerms.status ? data.statusId === searchTerms.status : true) &&
        (searchTerms.referenceNumber
          ? data.refNumber
              .toLowerCase()
              .includes(searchTerms.referenceNumber.toLowerCase())
          : true) &&
        (searchTerms.category
          ? data.categoryId === searchTerms.category
          : true) &&
        (searchTerms.assignedToId
          ? data.assignedToId === searchTerms.assignedToId
          : true)
      );
    };

    this.dataSource.sortingDataAccessor = (
      item: Ticket,
      property: keyof Ticket | string
    ) => {
      switch (property) {
        case 'category':
          return item.category?.name ?? '';
        case 'status':
          return item.status?.name ?? '';
        case 'assignedTo':
          return item.assignedTo?.userName ?? '';
        default:
          return (item as any)[property];
      }
    };
  }
  async displayColumns() {
    const userRole = (await this.userService.getUserRole()) ?? UserRoles.Client;
    switch (userRole) {
      case UserRoles.Client:
        this.displayedColumns = [
          'refNumber',
          'title',
          'category',
          'status',
          'assignedTo',
        ];
        break;

      case UserRoles.SupportManager:
        this.displayedColumns = [
          'refNumber',
          'title',
          'category',
          'status',
          'assignedTo',
          'actions',
        ];
        break;

      case UserRoles.Employee:
        this.displayedColumns = [
          'refNumber',
          'title',
          'category',
          'status',
          'actions',
        ];
        break;

      case UserRoles.Admin:
        this.displayedColumns = [
          'refNumber',
          'title',
          'description',
          'category',
          'status',
          'assignedTo',
          'actions',
        ];
        break;
    }
  }

  loadFilterOptions() {
    this.userService.getAllUsersRoles().subscribe((response) => {
      this.users = response;
    });

    this.categoryService
      .getCategoriesByType(CategoryType.TicketCategory)
      .subscribe((data: Category[]) => {
        this.categories = data;
      });

    this.categoryService
      .getCategoriesByType(CategoryType.TicketStatus)
      .subscribe((data: Category[]) => {
        this.ticketStatus = data[0].subcategory;
      });
  }
  applyFilter() {
    this.dataSource.filter = JSON.stringify(this.filterValues);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter(field: keyof typeof this.filterValues) {
    this.filterValues[field] = '';
    this.applyFilter();
  }

  addTicket() {
    const dialogRef = this.dialog.open(TicketDialogComponent, {
      width: '500px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadTickets();
    });
  }

  editTicket(ticket: Ticket) {
    const dialogRef = this.dialog.open(TicketDialogComponent, {
      width: '500px',
      data: { mode: 'edit', ticket },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadTickets();
    });
  }

  deleteTicket(ticketId: number) {
    this.confirmService
      .confirm('delete_title', 'delete_message', 'delete')
      .subscribe((result) => {
        if (result) {
          this.ticketService.deleteTicket(ticketId).subscribe(() => {
            this.loadTickets();
          });
        }
      });
  }
}
