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
import { forkJoin } from 'rxjs';
import { UserRoles } from 'src/app/Enums/user-roles';
import { format } from 'date-fns';

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
  form!: FormGroup;
  ticket?: Ticket;

  categories: Category[] = [];
  ticketPriority: Subcategory[] = [];
  supportOptions: Subcategory[] = [];
  ticketStatus: Subcategory[] = [];
  subcategories: Subcategory[] = [];
  users: UserRole[] = [];

  currentUserRole?: UserRoles;
  categoryType: CategoryType = CategoryType.TicketCategory;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private categoryService: CategoryService,
    private userService: UserService,
    public dialogRef: MatDialogRef<TicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getUserRole();
    this.buildForm();
    this.loadCategories();
    this.getUsers();
  }

  async getUserRole() {
    this.currentUserRole = await this.userService.getUserRole();
  }

  buildForm() {
    if (this.currentUserRole === UserRoles.Client) {
      this.form = this.fb.group({
        title: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
        description: [
          '',
          [Validators.required, Validators.pattern(/^(?!\s*$).+/)],
        ],
        categoryId: [null, Validators.required],
        subcategoryId: [null],
        supportOptionId: [null, Validators.required],
        statusId: [21],
      });
    } else {
      this.form = this.fb.group({
        title: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
        description: [
          '',
          [Validators.required, Validators.pattern(/^(?!\s*$).+/)],
        ],
        priorityId: [null],
        statusId: [21],
        categoryId: [null, Validators.required],
        subcategoryId: [null],
        startDate: [null],
        deliveryDate: [null],
        assignedToId: [null],
        supportOptionId: [null, Validators.required],
      });
    }
  }

  getUsers() {
    this.userService.getAllUsersRoles().subscribe((response) => {
      this.users = response;
    });
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
    const subcategoryControl = this.form.get('subcategoryId');
    subcategoryControl?.setValue(null);
    subcategoryControl?.clearValidators();

    if (!categoryId) {
      subcategoryControl?.updateValueAndValidity();
      return;
    }

    this.categoryService
      .getSubcategoriesByCategoryId(categoryId)
      .subscribe((data: Subcategory[]) => {
        this.subcategories = data;

        if (this.subcategories.length > 0) {
          subcategoryControl?.setValidators([Validators.required]);
        } else {
          subcategoryControl?.clearValidators();
        }

        subcategoryControl?.updateValueAndValidity();
      });
  }

  isFieldVisible(fieldName: string): boolean {
    if (this.currentUserRole === undefined) return false;

    if (this.currentUserRole === UserRoles.Client) {
      const clientFields = [
        'title',
        'supportOptionId',
        'categoryId',
        'subcategoryId',
        'description',
      ];
      return clientFields.includes(fieldName);
    }

    return true;
  }

  save() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const ticketData: Ticket = {
      ...this.ticket,
      ...formValue,
      startDate: this.formatDate(formValue.startDate),
      deliveryDate: this.formatDate(formValue.deliveryDate),
    };

    this.ticketService.addTicket(ticketData).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => console.error('Failed to save ticket', err),
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

  close() {
    this.dialogRef.close(false);
  }
}
