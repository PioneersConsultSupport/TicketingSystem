import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DemoMaterialModule } from '../demo-material-module';
import { TranslatePipe } from './pipes/translate.pipe';




@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>{{ 'Confirmation' | translate }}</h2>
    <mat-dialog-content>{{ data.message | translate }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'Cancel' | translate }}</button>
      <button mat-button color="primary" (click)="onConfirm()">{{ 'Yes' | translate }}</button>
    </mat-dialog-actions>
  `,
  imports: [
    DemoMaterialModule,
    TranslatePipe // Add TranslatePipe here
  ],
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
