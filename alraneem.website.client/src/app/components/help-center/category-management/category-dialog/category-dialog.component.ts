import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-category-dialog',
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
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.scss',
})
export class CategoryDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category
  ) {
    this.form = this.fb.group({
      name: [
        data?.name?.trim() || '',
        [Validators.required, Validators.pattern(/^(?!\s*$).+/)],
      ],
      type: [
        data?.type?.trim() || '',
        [Validators.required, Validators.pattern(/^(?!\s*$).+/)],
      ],
    });
  }

  save() {
    if (this.form.invalid) return;

    const value = {
      ...this.form.value,
      name: this.form.value.name.trim(),
      type: this.form.value.type.trim(),
    };

    const result = { ...this.data, ...value };
    this.dialogRef.close(result);
  }

  close() {
    this.dialogRef.close();
  }
}
