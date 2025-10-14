import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TicketDialogComponent } from './ticket-dialog/ticket-dialog.component';
import { Ticket } from 'src/app/models/ticket';
import { TicketService } from 'src/app/services/ticket-service';
import { UserRoles } from 'src/app/enums/user-roles';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { UserService } from 'src/app/services/user-service';
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
import { CategoryType } from 'src/app/enums/category-types';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.Service';
import { Subcategory } from 'src/app/models/subcategory';
import { UserRole } from 'src/app/models/user-role';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

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
  displayedColumns: string[] = [
    'refNumber',
    'title',
    'category',
    'status',
    'assignedTo',
    'actions',
  ];
  users: UserRole[] = [];
  currentUserRole?: UserRoles;
  UserRoles = UserRoles;

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
    private router: Router,
    private ticketService: TicketService,
    private dialog: MatDialog,
    private userService: UserService,
    private confirmService: ConfirmDialogService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit() {
    this.getUserRole();
    this.loadFilterOptions();
  }
  loadTickets() {
    if (
      this.currentUserRole === UserRoles.Client ||
      this.currentUserRole === UserRoles.Employee
    ) {
      this.ticketService.getMyTickets().subscribe((res: Ticket[]) => {
        this.initDataSource(res);
        this.isLoading = false;
      });
    } else {
      this.ticketService.getAllTickets().subscribe((res: Ticket[]) => {
        this.initDataSource(res);
        this.isLoading = false;
      });
    }
  }
  async getUserRole() {
    this.currentUserRole = await this.userService.getUserRole();
    this.loadTickets();
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
      property: keyof Ticket | string,
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
    const filterCopy = { ...this.filterValues };
    filterCopy.referenceNumber = filterCopy.referenceNumber?.trim() || '';
    this.dataSource.filter = JSON.stringify(filterCopy);
    this.dataSource.paginator?.firstPage();
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

  viewTicket(ticketId: number) {
    this.router.navigate(['/support/ticket-details', ticketId]);
  }
}
