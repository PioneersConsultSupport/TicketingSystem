import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subcategory } from 'src/app/models/subcategory';
import { CategoryService } from 'src/app/Services/category.Service';
import { SubcategoryDialogComponent } from '../subcategory-dialog/subcategory-dialog.component';
import { ConfirmDialogService } from 'src/app/Services/confirm-dialog.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-subcategory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss'],
})
export class SubcategoryComponent implements OnInit {
  categoryName = '';
  subcategories: Subcategory[] = [];
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<Subcategory>();
  filterValue = '';

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private confirmDialog: ConfirmDialogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadSubcategories(id);
    }
    this.dataSource.filterPredicate = (data: Subcategory, filter: string) => {
      return data.name.toLowerCase().includes(filter.trim().toLowerCase());
    };
  }

  loadSubcategories(categoryId: number) {
    this.categoryService.getCategoryById(categoryId).subscribe((cat) => {
      this.categoryName = cat.name;
      this.dataSource.data = cat.subcategory || [];
    });
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  openAddSubcategoryDialog() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const dialogRef = this.dialog.open(SubcategoryDialogComponent, {
      data: {
        category: {
          id: id,
          name: this.categoryName,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && id) {
        const newSub: Subcategory = {
          ...result,
          categoryId: id,
        };
        this.categoryService
          .addSubcategory(newSub)
          .subscribe(() => this.loadSubcategories(id!));
      }
    });
  }

  editSubcategory(sub: Subcategory) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const dialogRef = this.dialog.open(SubcategoryDialogComponent, {
      data: {
        category: {
          id: id,
          name: this.categoryName,
        },
        subcategory: sub,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedSub: Subcategory = { ...sub, ...result };
        this.categoryService
          .updateSubcategory(updatedSub)
          .subscribe(() => this.loadSubcategories(id!));
      }
    });
  }

  deleteSubcategory(sub: Subcategory) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.confirmDialog
      .confirm(
        'Delete Subcategory',
        `Are you sure you want to delete subcategory "${sub.name}"?`,
        'delete'
      )
      .subscribe((result) => {
        if (result) {
          this.categoryService
            .deleteSubcategory(sub.id)
            .subscribe(() => this.loadSubcategories(id!));
        }
      });
  }
}
