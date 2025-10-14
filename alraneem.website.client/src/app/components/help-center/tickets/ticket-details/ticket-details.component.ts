import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { CategoryType } from 'src/app/enums/category-types';
import { Category } from 'src/app/models/category';
import { Subcategory } from 'src/app/models/subcategory';
import { Ticket } from 'src/app/models/ticket';
import { UserRole } from 'src/app/models/user-role';
import { CategoryService } from 'src/app/services/category.Service';
import { TicketService } from 'src/app/services/ticket-service';
import { UserService } from 'src/app/services/user-service';
import { TranslatePipe } from 'src/app/shared/pipes/translate.pipe';
import { TicketCommentsComponent } from '../../ticket-comments/ticket-comments.component';
import { TicketHistoryComponent } from '../../ticket-history/ticket-history.component';
import { TicketHistoryService } from 'src/app/services/ticket-history.service';
import { forkJoin } from 'rxjs';
import { UserRoles } from 'src/app/enums/user-roles';
import { TicketHistory } from 'src/app/models/ticket-history';
import { DeliveryDateHistoryComponent } from '../../ticket-history/delivery-date-history/delivery-date-history.component';
import { format } from 'date-fns';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    TranslatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTabsModule,
    TicketCommentsComponent,
    TicketHistoryComponent,
    DeliveryDateHistoryComponent,
  ],
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss'],
})
export class TicketDetailsComponent implements OnInit {
  ticket!: Ticket;
  form!: FormGroup;

  categories: Category[] = [];
  ticketPriority: Subcategory[] = [];
  supportOptions: Subcategory[] = [];
  ticketStatus: Subcategory[] = [];
  subcategories: Subcategory[] = [];
  users: UserRole[] = [];
  currentUserRole?: UserRoles;
  isLoaded = false;

  @ViewChild(TicketHistoryComponent)
  ticketHistoryComponent?: TicketHistoryComponent;
  @ViewChild(DeliveryDateHistoryComponent)
  deliveryDateHistoryComponent?: DeliveryDateHistoryComponent;

  constructor(
    private categoryService: CategoryService,
    private userService: UserService,
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ticketHistoryService: TicketHistoryService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.getUsers();

    this.userService.getUserRole().then((role) => {
      this.currentUserRole = role;
      this.isLoaded = true;
    });

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) this.getTicket(id);
    });
  }

  getTicket(id: number) {
    this.ticketService.getTicketById(id).subscribe((res) => {
      this.ticket = res;
      this.buildForm(res);
    });
  }

  buildForm(ticket: Ticket) {
    this.form = this.fb.group({
      title: [
        ticket?.title || '',
        [Validators.required, Validators.pattern(/^(?!\s*$).+/)],
      ],
      supportOptionId: [ticket.supportOptionId],
      assignedToId: [ticket.assignedToId],
      priorityId: [ticket.priorityId],
      statusId: [ticket.statusId],
      categoryId: [ticket.categoryId],
      subcategoryId: [ticket.subcategoryId],
      startDate: [ticket.startDate, Validators.required],
      deliveryDate: [ticket.deliveryDate, Validators.required],
      description: [
        ticket.description,
        [Validators.required, Validators.pattern(/^(?!\s*$).+/)],
      ],
    });

    if (ticket.categoryId) {
      this.loadSubcategories(ticket.categoryId);
    }

    this.form.get('categoryId')?.valueChanges.subscribe((categoryId) => {
      this.onCategoryChange(categoryId);
    });

    if (this.currentUserRole) {
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        if (control) {
          if (this.isReadOnly(key)) control.disable({ emitEvent: false });
          else control.enable({ emitEvent: false });
        }
      });
    }
  }

  async getUsers() {
    this.userService.getAllUsersRoles().subscribe((res) => (this.users = res));
  }

  loadCategories() {
    forkJoin({
      categories: this.categoryService.getCategoriesByType(
        CategoryType.TicketCategory,
      ),
      priorities: this.categoryService.getCategoriesByType(
        CategoryType.TicketPriority,
      ),
      statuses: this.categoryService.getCategoriesByType(
        CategoryType.TicketStatus,
      ),
      supportOptions: this.categoryService.getCategoriesByType(
        CategoryType.SupportOption,
      ),
    }).subscribe(({ categories, priorities, statuses, supportOptions }) => {
      this.categories = categories;
      this.ticketPriority = priorities[0]?.subcategory || [];
      this.ticketStatus = statuses[0]?.subcategory || [];
      this.supportOptions = supportOptions[0]?.subcategory || [];
    });
  }

  onCategoryChange(categoryId: number) {
    const subcategoryControl = this.form.get('subcategoryId');
    subcategoryControl?.setValue(null);
    subcategoryControl?.clearValidators();

    if (categoryId) {
      this.loadSubcategories(categoryId);
    } else {
      subcategoryControl?.updateValueAndValidity();
    }
  }

  loadSubcategories(categoryId: number) {
    this.categoryService
      .getSubcategoriesByCategoryId(categoryId)
      .subscribe((data: Subcategory[]) => {
        this.subcategories = data;

        const subcategoryControl = this.form.get('subcategoryId');

        if (this.subcategories.length > 0) {
          subcategoryControl?.setValidators([Validators.required]);
        } else {
          subcategoryControl?.clearValidators();
          subcategoryControl?.setValue(null);
        }
        subcategoryControl?.updateValueAndValidity({ emitEvent: true });
      });
  }

  save() {
    if (this.form.invalid || !this.ticket || !this.ticket.id) return;

    const formValue = this.form.value;

    const updatedTicket: Ticket = {
      ...this.ticket,
      ...formValue,
      startDate: this.formatDate(formValue.startDate),
      deliveryDate: this.formatDate(formValue.deliveryDate),
    };

    const changes = this.getTicketChanges(this.ticket, updatedTicket);

    this.ticketService
      .updateTicket(this.ticket.id, updatedTicket)
      .subscribe(() => {
        if (changes.length) {
          const history: TicketHistory = {
            ticketId: this.ticket.id,
            historyDetails: changes,
          };
          this.ticketHistoryService.saveHistory(history).subscribe({
            next: () => {
              this.ticketHistoryComponent?.loadHistory();
              this.deliveryDateHistoryComponent?.loadDeliveryDateHistory();
              this.ticket = { ...updatedTicket };
            },
          });
        } else {
          this.ticket = { ...updatedTicket };
        }
      });
  }
  private formatDate(date: any): string | null {
    if (!date) return null;

    try {
      return format(new Date(date), 'yyyy-MM-dd');
    } catch {
      return null;
    }
  }

  private getTicketChanges(oldTicket: Ticket, newTicket: Ticket): string[] {
    const changes: string[] = [];

    Object.keys(this.form.controls).forEach((key) => {
      const oldValue = (oldTicket as any)[key];
      const newValue = (newTicket as any)[key];

      if (oldValue !== newValue) {
        const displayOld = this.getDisplayValue(key, oldValue) || 'none';
        const displayNew = this.getDisplayValue(key, newValue) || 'none';
        const fieldName = this.getFieldName(key);
        changes.push(
          `${fieldName} changed from "${displayOld}" to "${displayNew}"`,
        );
      }
    });

    return changes;
  }

  private getDisplayValue(key: string, value: any): string {
    if (value === null || value === undefined || value === '') return '';
    switch (key) {
      case 'categoryId':
        return this.categories.find((c) => c.id === value)?.name || '';
      case 'subcategoryId':
        return this.subcategories.find((s) => s.id === value)?.name || '';
      case 'priorityId':
        return this.ticketPriority.find((p) => p.id === value)?.name || '';
      case 'statusId':
        return this.ticketStatus.find((s) => s.id === value)?.name || '';
      case 'assignedToId':
        return this.users.find((u) => u.id === value)?.userName || '';
      case 'startDate':
      case 'deliveryDate':
        return value ? new Date(value).toLocaleDateString() : '';
      default:
        return value ?? '';
    }
  }

  private getFieldName(key: string): string {
    const map: Record<string, string> = {
      categoryId: 'Category',
      subcategoryId: 'Subcategory',
      priorityId: 'Priority',
      statusId: 'Status',
      assignedToId: 'Assigned To',
      startDate: 'Start Date',
      deliveryDate: 'Delivery Date',
      description: 'Description',
      title: 'Title',
    };
    return map[key] || key;
  }

  isReadOnly(field: string): boolean {
    if (this.currentUserRole === undefined) return true;

    switch (this.currentUserRole) {
      case UserRoles.Client:
        return !['title', 'description'].includes(field);
      case UserRoles.Admin:
      case UserRoles.SupportManager:
        return false;
      case UserRoles.Employee:
        return field !== 'statusId';
      default:
        return true;
    }
  }

  shouldShow(field: string): boolean {
    if (this.currentUserRole === undefined) return false;

    switch (this.currentUserRole) {
      case UserRoles.Client:
        return [
          'title',
          'supportOptionId',
          'categoryId',
          'subcategoryId',
          'description',
        ].includes(field);
      case UserRoles.Admin:
      case UserRoles.SupportManager:
        return true;
      case UserRoles.Employee:
        return [
          'title',
          'categoryId',
          'subcategoryId',
          'priorityId',
          'statusId',
          'assignedToId',
          'description',
        ].includes(field);
      default:
        return false;
    }
  }

  cancel() {
    window.history.back();
  }
}
