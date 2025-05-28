import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/UserService';
import { UserRoles } from 'src/app/Enums/user-roles';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styles: [],
})
export class AdminPanelComponent implements OnInit {
  adminForm: FormGroup;

  users: User[] = [];
  dataSource!: MatTableDataSource<{ key: string; value: number }>;
  roles: { key: string; value: number }[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [];
  objectEnum = this.getEnumEntries();

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.adminForm = this.fb.group({
      id: [''],
      userRoleId: ['', Validators.required],
      userEmail: ['', Validators.required],
      userName: [''],
    });
  }

  search() {
    this.userService.getAllUsersRoles().subscribe((response) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit(): void {
    this.search();
    this.userService.getAllUsers().subscribe((response) => {
      this.users = response;
      this.roles = this.enumToKeyValueArray(UserRoles);
    });
    this.displayedColumns = [
      'userName',
      'userEmail',
      'userRoleId',
      'edit',
      'delete',
    ];
  }

  onSubmit(): void {
    if (this.adminForm.valid) {
      const user = this.adminForm.value;
      const userNameOjbect = this.users.find(x => x.mail == user.userEmail) ?? null;
      if (!user.id) {
        this.userService
          .addUserRole(user.userRoleId, user.userEmail, userNameOjbect?.displayName ?? '')
          .subscribe((response) => {
            this.adminForm.reset();
            this.search();
          });
      } else
        this.userService
          .updateUserRole(
            user.id,
            user.userRoleId,
            user.userEmail,
            user.userName
          )
          .subscribe((response) => {
            this.adminForm.reset();
            this.search();
          });
    }
  }

  edit(detail: any) {
    this.adminForm.setValue({
      id: detail.id,
      userRoleId: detail.userRoleId,
      userEmail: detail.userEmail,
      userName: detail.userName,
    });
  }

  deleteRole(detail: any) {
    this.userService
      .deleteUserRole(
        detail.id,
        detail.userRoleId,
        detail.userEmail,
        detail.userName
      )
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
