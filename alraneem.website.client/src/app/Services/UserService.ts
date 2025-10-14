import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { UserRoles } from '../Enums/user-roles';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = 'UserRole';
  private userRoleSubject = new BehaviorSubject<UserRoles | null>(null);
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<any>(this.baseUrl + '/AllUsers');
  }

  addUserRole(roleId: number, userEmail: string, userName: string) {
    return this.http.post(this.baseUrl, {
      UserEmail: userEmail,
      UserRoleId: roleId,
      UserName: userName,
    });
  }

  updateUserRole(
    id: number,
    roleId: number,
    userEmail: string,
    userName: string
  ) {
    return this.http.post(this.baseUrl + '/Update', {
      UserEmail: userEmail,
      UserRoleId: roleId,
      Id: id,
      UserName: userName,
    });
  }

  deleteUserRole(
    id: number,
    roleId: number,
    userEmail: string,
    userName: string
  ) {
    return this.http.post(this.baseUrl + '/Delete', {
      UserEmail: userEmail,
      UserRoleId: roleId,
      Id: id,
      UserName: userName,
    });
  }

  getUsersByRole() {
    return this.http.get<any>(this.baseUrl + '/GetUsersByRole');
  }

  getAllUsersRoles() {
    return this.http.get<any>(this.baseUrl);
  }

  async getUserRole(): Promise<UserRoles> {
    const user = await firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/GetUser`)
    );
    const role = user.userRoleId as UserRoles;
    this.userRoleSubject.next(role);
    return role;
  }

  setUserRole(role: UserRoles) {
  this.userRoleSubject.next(role);
}

  async getCurrentUserAsync(): Promise<any> {
    return await firstValueFrom(this.http.get<any>(`${this.baseUrl}/GetUser`));
  }
}
