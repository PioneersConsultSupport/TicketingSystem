import { Component, Inject } from '@angular/core';
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
import { UserRoles } from '../Enums/user-roles';

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
  ],
  templateUrl: './ticket-dialog.component.html',
  styleUrls: ['./ticket-dialog.component.scss'],
})
export class TicketDialogComponent {
  ticketForm: FormGroup;
  isEditMode = false;

  categoryList: { key: string; value: number }[] = [];
  subCategoryList: { key: string; value: number }[] = [];
  supportOptionList: { key: string; value: number }[] = [];
  ticketPriorityList: { key: string; value: number }[] = [];
  statusList: { key: string; value: number }[] = [];
  assignedToList: { key: string; value: number }[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data.ticket;
    this.ticketForm = this.fb.group({
      id: [{ value: data?.ticket?.id || 0, disabled: data.isViewMode }],
      title: [{ value: data?.ticket?.title || '', disabled: data.isViewMode }],
      categoryId: [
        { value: data?.ticket?.categoryId || null, disabled: data.isViewMode },
      ],
      statusId: [
        { value: data?.ticket?.statusId || null, disabled: data.isViewMode },
      ],
      supportTypeId: [
        {
          value: data?.ticket?.supportTypeId || null,
          disabled: data.isViewMode,
        },
      ],
      subcategoryId: [
        {
          value: data?.ticket?.subcategoryId || null,
          disabled: data.isViewMode,
        },
      ],
      priorityId: [
        { value: data?.ticket?.priorityId || null, disabled: data.isViewMode },
      ],
      assignedToId: [
        {
          value: data?.ticket?.assignedToId || null,
          disabled: data.isViewMode,
        },
      ],
      description: [
        { value: data?.ticket?.description || '', disabled: data.isViewMode },
      ],
      createdById: [
        { value: data?.userRole?.id || null, disabled: data.isViewMode },
      ],
    });
    this.categoryList = this.getLookupByType('Category');
    // this.subCategoryList = this.getLookupByType('Subcategory');
    this.supportOptionList = this.getLookupByType('SupportOption');
    this.ticketPriorityList = this.getLookupByType('TicketPriority');
    this.statusList = this.getLookupByType('TicketStatus');
    this.getSubcategoryByCategory()
    this.assignedToList = data.assignedToList;
    this.clearAllControls();
    this.setRequiredValidators();
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.ticketForm.valid) {
      const ticketData = this.ticketForm.value;
      this.dialogRef.close({
        action: this.isEditMode ? 'edit' : 'create',
        data: ticketData,
      });
    }
  }

  getLookupByType(type: string, isParent?: boolean) {
    let parentId = 0;
    if (isParent) {
      parentId = this.ticketForm.get('categoryId')?.value;
    }
    return this.data.lookups
      .filter(
        (x: any) =>
          type == x.type && (parentId ? x.parentId === parentId : true)
      )
      .map((x: any) => ({ key: x.name, value: x.id }));
  }

  setRequiredValidators() {
    let controls;
    if (this.data.userRole.userRoleId == UserRoles.Client)
      controls = [
        'title',
        'categoryId',
        'supportTypeId',
        'subcategoryId',
        'description',
      ];
    else if (this.data.userRole.userRoleId == UserRoles.Employee)
      controls = [
        'title',
        'categoryId',
        'statusId',
        'subcategoryId',
        'priorityId',
        'description',
      ];
    else
      controls = [
        'title',
        'categoryId',
        'statusId',
        'subcategoryId',
        'priorityId',
        'assignedToId',
        'description',
      ];

    controls.forEach((control) => {
      this.ticketForm.get(control)?.setValidators([Validators.required]);
      this.ticketForm.get(control)?.updateValueAndValidity();
    });
  }

  clearAllControls() {
    Object.keys(this.ticketForm.controls).forEach((controlName) => {
      const control = this.ticketForm.get(controlName);
      control?.clearValidators();
      control?.updateValueAndValidity();
    });
  }

  hasRequiredValidator(controlName: string): boolean {
    const control = this.ticketForm.get(controlName);
    if (!control || !control.validator) return false;

    const validator = control.validator({} as AbstractControl);
    return validator?.['required'] ?? false;
  }

  getSubcategoryByCategory(){
    this.subCategoryList = this.getLookupByType('Subcategory', true);
    if(!this.subCategoryList.length){
      let control = this.ticketForm.get('subcategoryId');
      control?.clearValidators();
      control?.updateValueAndValidity();
    }
  }
}
