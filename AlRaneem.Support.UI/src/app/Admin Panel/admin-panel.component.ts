import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/UserService';
import { user } from '../models/user';
import { UserRoles } from '../Enums/user-roles';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styles: [],
})
export class AdminPanelComponent implements OnInit {
  adminForm: FormGroup;

  users: user[] = [];
  dataSource!: MatTableDataSource<{ key: string; value: number }>;
  roles: { key: string; value: number }[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [];
  objectEnum = this.getEnumEntries();

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.adminForm = this.fb.group({
      id: [''],
      user: [''],
      role: [''],
    });
  }

  search() {
    this.userService.getAllUsersRoles().subscribe((response) => {
      this.dataSource = new MatTableDataSource(response.Data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  
  ngOnInit(): void {
    this.search();
    this.userService.getAllUsers().subscribe((response) => {
      this.users = response.Data;
      this.roles = this.enumToKeyValueArray(UserRoles);
    });
    this.displayedColumns = ['userEmail', 'userRoleId', 'edit', 'delete'];
  }

  onSubmit(): void {
    if (this.adminForm.valid) {
      const { user, role, id } = this.adminForm.value;
      if (!id)
        this.userService.addUserRole(role, user).subscribe((response) => {
          this.adminForm.reset();
          this.search();
        });
      else
        this.userService
          .updateUserRole(id, role, user)
          .subscribe((response) => {
            this.adminForm.reset();
            this.search();
          });
    }
  }

  edit(detail: any) {
    this.adminForm.setValue({
      user: detail.userEmail,
      role: detail.userRoleId,
      id: detail.id,
    });
  }

  deleteRole(detail: any) {
    this.userService
      .deleteUserRole(detail.id, detail.userRoleId, detail.userEmail)
      .subscribe((response) => {
        this.search();
      });
  }

  enumToKeyValueArray(enumObj: any): { key: string; value: number }[] {
    return Object.keys(enumObj)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({ key, value: enumObj[key] }));
  }

  getEnumEntries() {
    return Object.fromEntries(
      Object.keys(UserRoles)
        .filter((key) => isNaN(Number(key)))
        .map((key) => [UserRoles[key as keyof typeof UserRoles], key])
    );
  }
}
