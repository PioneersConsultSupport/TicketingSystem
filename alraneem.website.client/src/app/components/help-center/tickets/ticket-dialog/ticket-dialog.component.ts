import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from 'src/app/shared/pipes/translate.pipe';
import { Ticket } from 'src/app/models/ticket';
import { TicketService } from 'src/app/Services/ticketService';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/Services/category.Service';
import { Subcategory } from 'src/app/models/subcategory';
import { CategoryType } from 'src/app/Enums/category-types';
import { UserService } from 'src/app/Services/UserService';
import { UserRole } from 'src/app/models/user-role';

@Component({
  selector: 'app-ticket-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    TranslatePipe,
  ],
  templateUrl: './ticket-dialog.component.html',
  styleUrls: ['./ticket-dialog.component.scss'],
})
export class TicketDialogComponent implements OnInit {
  form: FormGroup;
  mode: 'create' | 'edit';
  ticket?: Ticket;
  categories: Category[] = [];
  ticketPriority: Subcategory[] = [];
  supportOptions: Subcategory[] = [];
  ticketStatus: Subcategory[] = [];
  subcategories: Subcategory[] = [];
  users: UserRole[] = [];
  categoryType: CategoryType = CategoryType.TicketCategory;
  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<TicketDialogComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode;
    this.ticket = data.ticket;

    this.form = this.fb.group({
      title: [this.ticket?.title || '', Validators.required],
      description: [this.ticket?.description || '', Validators.required],
      priorityId: [this.ticket?.priorityId || null],
      statusId: [this.ticket?.statusId || null],
      categoryId: [this.ticket?.categoryId || null],
      subcategoryId: [this.ticket?.subcategoryId || null],
      startDate: [this.ticket?.startDate || null],
      deliveryDate: [this.ticket?.deliveryDate || null],
      assignedToId: [this.ticket?.assignedToId || null],
      supportOptionId: [this.ticket?.supportOptionId || null],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.getUsers();
    this.form
      .get('categoryId')
      ?.valueChanges.subscribe((categoryId: number) => {
        this.onCategoryChange(categoryId);
      });

    if (this.ticket?.categoryId) {
      this.onCategoryChange(this.ticket.categoryId);
    }
  }

  getUsers() {
    this.userService.getAllUsersRoles().subscribe((response) => {
      this.users = response;
    });
  }
  loadCategories() {
    this.categoryService
      .getCategoriesByType(CategoryType.TicketCategory)
      .subscribe((data: Category[]) => {
        this.categories = data;
      });
    this.categoryService
      .getCategoriesByType(CategoryType.TicketPriority)
      .subscribe((data: Category[]) => {
        this.ticketPriority = data[0].subcategory;
      });
    this.categoryService
      .getCategoriesByType(CategoryType.TicketStatus)
      .subscribe((data: Category[]) => {
        this.ticketStatus = data[0].subcategory;
      });
    this.categoryService
      .getCategoriesByType(CategoryType.SupportOption)
      .subscribe((data: Category[]) => {
        this.supportOptions = data[0].subcategory;
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
    if (this.form.invalid) return;

    const ticketData: Ticket = { ...this.ticket, ...this.form.value };

    if (this.mode === 'create') {
      this.ticketService.addTicket(ticketData).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.ticketService
        .updateTicket(this.ticket!.id!, ticketData)
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
