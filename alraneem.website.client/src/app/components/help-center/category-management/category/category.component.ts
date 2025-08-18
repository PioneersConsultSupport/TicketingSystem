import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Category } from 'src/app/models/category';
import { Subcategory } from 'src/app/models/subcategory';
import { CategoryService } from 'src/app/Services/category.Service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { SubcategoryDialogComponent } from '../subcategory-dialog/subcategory-dialog.component';
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'src/app/Services/confirm-dialog.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'actions'];
  dataSource!: MatTableDataSource<Category>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private router: Router,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe((data: Category[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openCategoryDialog(category?: Category) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: category ? { ...category } : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (category) {
          this.categoryService
            .updateCategory(result)
            .subscribe(() => this.loadCategories());
        } else {
          this.categoryService
            .addCategory(result)
            .subscribe(() => this.loadCategories());
        }
      }
    });
  }

  deleteCategory(category: Category) {
  this.confirmDialog
    .confirm(
      'Delete Category',
      `Are you sure you want to delete category "${category.name}"?`,
      'delete'
    )
    .subscribe(result => {
      if (result) {
        this.categoryService.deleteCategory(category.id).subscribe({
          next: () => this.loadCategories(),
          error: err => alert('Error deleting category: ' + err.message)
        });
      }
    });
}

  goToSubcategory(categoryId: number) {
    this.categoryService.selectedCategoryId = categoryId;
    if (this.categoryService.selectedCategoryId) {
      this.router.navigate(['/support/category-management/subcategory']);
    }
  }
}
