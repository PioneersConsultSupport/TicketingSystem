import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from 'src/app/models/category';
import { Subcategory } from 'src/app/models/subcategory';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-subcategory-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './subcategory-dialog.component.html',
  styleUrls: ['./subcategory-dialog.component.scss'],
})
export class SubcategoryDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SubcategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { category: Category; subcategory?: Subcategory },
  ) {
    this.form = this.fb.group({
      name: [
        data.subcategory?.name?.trim() || '',
        [Validators.required, Validators.pattern(/^(?!\s*$).+/)],
      ],
    });
  }

  save() {
    if (this.form.invalid) return;

    const value = {
      ...this.form.value,
      name: this.form.value.name.trim(),
    };

    const result: Subcategory = {
      ...this.data.subcategory,
      ...value,
      categoryId: this.data.category.id,
    };

    this.dialogRef.close(result);
  }

  close() {
    this.dialogRef.close();
  }
}
