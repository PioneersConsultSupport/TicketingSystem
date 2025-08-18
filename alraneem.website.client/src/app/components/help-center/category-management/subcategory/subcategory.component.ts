import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subcategory } from 'src/app/models/subcategory';
import { CategoryService } from 'src/app/Services/category.Service';
import { SubcategoryDialogComponent } from '../subcategory-dialog/subcategory-dialog.component';
import { ConfirmDialogService } from 'src/app/Services/confirm-dialog.service';

@Component({
  selector: 'app-subcategory',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss'],
})
export class SubcategoryComponent implements OnInit {
  categoryName = '';
  subcategories: Subcategory[] = [];
  displayedColumns: string[] = ['name', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    if (this.categoryService.selectedCategoryId) {
      this.loadSubcategories(this.categoryService.selectedCategoryId);
    }
  }

  loadSubcategories(categoryId: number) {
    this.categoryService.getCategoryById(categoryId).subscribe((cat) => {
      this.categoryName = cat.name;
      this.subcategories = cat.subcategory || [];
    });
  }

  openAddSubcategoryDialog() {
    const dialogRef = this.dialog.open(SubcategoryDialogComponent, {
      data: { category: { id: this.categoryService.selectedCategoryId, name: this.categoryName } }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.categoryService.selectedCategoryId) {
        const newSub: Subcategory = { ...result, categoryId: this.categoryService.selectedCategoryId };
        this.categoryService.addSubcategory(newSub)
          .subscribe(() => this.loadSubcategories(this.categoryService.selectedCategoryId!));
      }
    });
  }

  editSubcategory(sub: Subcategory) {
    const dialogRef = this.dialog.open(SubcategoryDialogComponent, {
      data: { category: { id: this.categoryService.selectedCategoryId, name: this.categoryName }, subcategory: sub }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedSub: Subcategory = { ...sub, ...result };
        this.categoryService.updateSubcategory(updatedSub)
          .subscribe(() => this.loadSubcategories(this.categoryService.selectedCategoryId!));
      }
    });
  }

  deleteSubcategory(sub: Subcategory) {
    this.confirmDialog
      .confirm(
        'Delete Subcategory',
        `Are you sure you want to delete subcategory "${sub.name}"?`,
        'delete'
      )
      .subscribe(result => {
        if (result) {
          this.categoryService.deleteSubcategory(sub.id)
            .subscribe(() => this.loadSubcategories(this.categoryService.selectedCategoryId!));
        }
      });
  }
}
