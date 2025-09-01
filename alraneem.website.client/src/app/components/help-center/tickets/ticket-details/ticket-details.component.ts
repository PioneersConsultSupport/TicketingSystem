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
import { CategoryType } from 'src/app/Enums/category-types';
import { Category } from 'src/app/models/category';
import { Subcategory } from 'src/app/models/subcategory';
import { Ticket } from 'src/app/models/ticket';
import { UserRole } from 'src/app/models/user-role';
import { CategoryService } from 'src/app/Services/category.Service';
import { TicketService } from 'src/app/Services/ticketService';
import { UserService } from 'src/app/Services/UserService';
import { TranslatePipe } from 'src/app/shared/pipes/translate.pipe';
import { TicketCommentsComponent } from '../../ticket-comments/ticket-comments.component';
import { TicketHistoryComponent } from '../../ticket-history/ticket-history.component';
import { TicketHistoryService } from 'src/app/Services/ticket-history.service';
import { TicketHistory } from 'src/app/models/ticket-history';
import { forkJoin } from 'rxjs';

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

  @ViewChild(TicketHistoryComponent)
  ticketHistoryComponent?: TicketHistoryComponent;

  constructor(
    private categoryService: CategoryService,
    private userService: UserService,
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ticketHistoryService: TicketHistoryService
  ) {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.getTicket(id);
      }
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.getUsers();
    this.getUserRole();
  }

  getTicket(id: number) {
    this.ticketService.getTicketById(id).subscribe((res) => {
      this.ticket = res;
      this.buildForm(res);
    });
  }

  buildForm(ticket: Ticket) {
    this.form = this.fb.group({
      title: [ticket?.title || '', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      supportOptionId: [ticket.supportOptionId],
      assignedToId: [ticket.assignedToId],
      priorityId: [ticket.priorityId],
      statusId: [ticket.statusId],
      categoryId: [ticket.categoryId],
      subcategoryId: [ticket.subcategoryId],
      startDate: [ticket.startDate],
      deliveryDate: [ticket.deliveryDate],
      description: [ticket.description,[Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    });

    if (ticket.categoryId) {
      this.loadSubcategories(ticket.categoryId);
    }

    this.form.get('categoryId')?.valueChanges.subscribe((categoryId) => {
      this.onCategoryChange(categoryId);
    });
  }

  async getUsers() {
    this.userService.getAllUsersRoles().subscribe((res) => (this.users = res));
  }

  async getUserRole() {
    const userRole = await this.userService.getUserRole();
  }

  loadCategories() {
    forkJoin({
      categories: this.categoryService.getCategoriesByType(
        CategoryType.TicketCategory
      ),
      priorities: this.categoryService.getCategoriesByType(
        CategoryType.TicketPriority
      ),
      statuses: this.categoryService.getCategoriesByType(
        CategoryType.TicketStatus
      ),
      supportOptions: this.categoryService.getCategoriesByType(
        CategoryType.SupportOption
      ),
    }).subscribe(({ categories, priorities, statuses, supportOptions }) => {
      this.categories = categories;
      this.ticketPriority = priorities[0]?.subcategory || [];
      this.ticketStatus = statuses[0]?.subcategory || [];
      this.supportOptions = supportOptions[0]?.subcategory || [];
    });
  }

  onCategoryChange(categoryId: number) {
    this.subcategories = [];
    this.form.get('subcategoryId')?.setValue(null);

    if (categoryId) {
      this.loadSubcategories(categoryId);
      if (this.ticket?.subcategoryId) {
        this.form.get('subcategoryId')?.setValue(this.ticket.subcategoryId);
      }
    }
  }

  loadSubcategories(categoryId: number) {
    this.categoryService
      .getSubcategoriesByCategoryId(categoryId)
      .subscribe((data: Subcategory[]) => {
        this.subcategories = data;

        if (this.subcategories.length > 0 && this.ticket?.subcategoryId) {
          this.form.get('subcategoryId')?.setValue(this.ticket.subcategoryId);
        } else {
          this.form.get('subcategoryId')?.setValue(null);
        }
      });
  }

  save() {
    if (this.form.invalid || !this.ticket || !this.ticket.id) return;

    const updatedTicket: Ticket = { ...this.ticket, ...this.form.value };

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
            next: () => this.ticketHistoryComponent?.loadHistory(),
          });
        }
      });
  }

  private getTicketChanges(oldTicket: Ticket, newTicket: Ticket): string[] {
    const changes: string[] = [];

    Object.keys(this.form.controls).forEach((key) => {
      const oldValue = (oldTicket as any)[key];
      const newValue = (newTicket as any)[key];

      if (oldValue !== newValue) {
        let displayOld = this.getDisplayValue(key, oldValue);
        let displayNew = this.getDisplayValue(key, newValue);
        let fieldName = this.getFieldName(key);

        changes.push(
          `${fieldName} changed from "${displayOld}" to "${displayNew}"`
        );
      }
    });

    return changes;
  }

  private getDisplayValue(key: string, value: any): string {
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

  cancel() {
    window.history.back();
  }
}
