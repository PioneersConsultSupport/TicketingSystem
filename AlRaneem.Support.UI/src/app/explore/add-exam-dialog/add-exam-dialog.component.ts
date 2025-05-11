import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DemoMaterialModule } from '../../demo-material-module';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-add-exam-dialog',
  standalone: true,
  imports: [
    DemoMaterialModule, FormsModule, NgIf, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, TranslatePipe, MatDialogModule  // If you're using forms inside the dialog
  ],
  templateUrl: './add-exam-dialog.component.html',
  styleUrl: './add-exam-dialog.component.scss'
})
export class AddExamDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddExamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { examName: string }
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddClick(): void {
    if (this.data.examName.trim()) {
      this.dialogRef.close(this.data.examName);  // Return the exam name if it's valid
    }
  }
}
