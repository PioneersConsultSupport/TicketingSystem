import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/UserService';
import { user } from '../models/user';
import { UserRoles } from '../Enums/user-roles';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styles: []
})
export class AdminPanelComponent implements OnInit {
  adminForm: FormGroup;

  users: user[] = [];

  roles:{ key: string, value: number }[] = [];

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.adminForm = this.fb.group({
      user: [''],
      role: ['']
    });
  }

    ngOnInit(): void {
        this.userService.getAllUsers().subscribe(response => {
            this.users = response.Data;
            this.roles = this.enumToKeyValueArray(UserRoles);
        });
    }

  onSubmit(): void {
    if (this.adminForm.valid) {
        const { user, role } = this.adminForm.value;
        this.userService.addUserRole(role, user).subscribe(response =>{
            console.log(response);
        });
    }
  }

  enumToKeyValueArray(enumObj: any): { key: string, value: number }[] {
    return Object.keys(enumObj)
        .filter(key => isNaN(Number(key)))
        .map(key => ({ key, value: enumObj[key] }));
  }
}
