import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/Services/category.Service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'src/app/Services/confirm-dialog.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'actions'];
  dataSource!: MatTableDataSource<Category>;
  categories: Category[] = [];
  types: string[] = [];
  filterValues = {
    name: '',
    type: '',
  };

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
      this.categories = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.types = [...new Set(data.map((c) => c.type))];
      this.dataSource.filterPredicate = (
        category: Category,
        filter: string
      ) => {
        const searchTerms = JSON.parse(filter);

        const nameFilter = searchTerms.name?.trim().toLowerCase() || '';
        const typeFilter = searchTerms.type?.trim() || '';

        const matchesName = nameFilter
          ? category.name.toLowerCase().includes(nameFilter)
          : true;

        const matchesType = typeFilter ? category.type === typeFilter : true;

        return matchesName && matchesType;
      };
    });
  }

  applyFilter() {
    this.filterValues.name = this.filterValues.name.trim();
    this.filterValues.type = this.filterValues.type.trim();
    this.dataSource.filter = JSON.stringify(this.filterValues);
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
      .subscribe((result) => {
        if (result) {
          this.categoryService.deleteCategory(category.id).subscribe({
            next: () => this.loadCategories(),
            error: (err) => alert('Error deleting category: ' + err.message),
          });
        }
      });
  }

  goToSubcategory(categoryId: number) {
    this.router.navigate([
      '/support/category-management/subcategory',
      categoryId,
    ]);
  }
}
