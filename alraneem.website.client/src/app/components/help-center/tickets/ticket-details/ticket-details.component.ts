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
      title: [ticket?.title || '', Validators.required],
      supportOptionId: [ticket.supportOptionId],
      assignedToId: [ticket.assignedToId],
      priorityId: [ticket.priorityId],
      statusId: [ticket.statusId],
      categoryId: [ticket.categoryId],
      subcategoryId: [ticket.subcategoryId],
      startDate: [ticket.startDate],
      deliveryDate: [ticket.deliveryDate],
      description: [ticket.description, Validators.required],
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
    this.categoryService
      .getCategoriesByType(CategoryType.TicketCategory)
      .subscribe((data) => (this.categories = data));

    this.categoryService
      .getCategoriesByType(CategoryType.TicketPriority)
      .subscribe((data) => (this.ticketPriority = data[0].subcategory));

    this.categoryService
      .getCategoriesByType(CategoryType.TicketStatus)
      .subscribe((data) => (this.ticketStatus = data[0].subcategory));

    this.categoryService
      .getCategoriesByType(CategoryType.SupportOption)
      .subscribe((data) => (this.supportOptions = data[0].subcategory));
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
  if (this.form.invalid) return;

  const ticketData: Ticket = {
    ...this.ticket,
    ...this.form.value,
  };

  if (this.ticket && this.ticket.id) {
    const changes: string[] = [];

    Object.keys(this.form.controls).forEach((key) => {
      const oldValue = (this.ticket as any)[key];
      const newValue = this.form.get(key)?.value;

      if (oldValue !== newValue) {
        let displayOld = oldValue ?? '';
        let displayNew = newValue ?? '';
        let fieldName = key;

        switch (key) {
          case 'categoryId':
            displayOld = this.categories.find(c => c.id === oldValue)?.name || oldValue;
            displayNew = this.categories.find(c => c.id === newValue)?.name || newValue;
            fieldName = 'Category';
            break;
          case 'subcategoryId':
            displayOld = this.subcategories.find(s => s.id === oldValue)?.name || oldValue;
            displayNew = this.subcategories.find(s => s.id === newValue)?.name || newValue;
            fieldName = 'Subcategory';
            break;
          case 'priorityId':
            displayOld = this.ticketPriority.find(p => p.id === oldValue)?.name || oldValue;
            displayNew = this.ticketPriority.find(p => p.id === newValue)?.name || newValue;
            fieldName = 'Priority';
            break;
          case 'statusId':
            displayOld = this.ticketStatus.find(s => s.id === oldValue)?.name || oldValue;
            displayNew = this.ticketStatus.find(s => s.id === newValue)?.name || newValue;
            fieldName = 'Status';
            break;
          case 'assignedToId':
            displayOld = this.users.find(u => u.id === oldValue)?.userName || oldValue;
            displayNew = this.users.find(u => u.id === newValue)?.userName || newValue;
            fieldName = 'Assigned To';
            break;
          case 'startDate':
          case 'deliveryDate':
            if (oldValue) displayOld = new Date(oldValue).toLocaleDateString();
            if (newValue) displayNew = new Date(newValue).toLocaleDateString();
            fieldName = key === 'startDate' ? 'Start Date' : 'Delivery Date';
            break;
          case 'description':
            fieldName = 'Description';
            break;
          case 'title':
            fieldName = 'Title';
            break;
          default:
            fieldName = key;
        }

        changes.push(`${fieldName} changed from "${displayOld}" to "${displayNew}"`);
      }
    });

    this.ticketService.updateTicket(this.ticket.id, ticketData).subscribe({
      next: () => {
        if (changes.length > 0) {
          const history: TicketHistory = {
            ticketId: this.ticket.id,
            historyDetails: changes,
          };

          this.ticketHistoryService.saveHistory(history).subscribe({
            next: () => this.ticketHistoryComponent?.loadHistory(),
          });
        }
      },
    });
  }
}


  cancel() {
    window.history.back();
  }
}
