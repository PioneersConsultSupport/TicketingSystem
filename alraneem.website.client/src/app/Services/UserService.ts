import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = 'UserRole';

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
    return this.http.put(this.baseUrl, {
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

  async getUserRole() {
    const user = await this.getUserRoleAsync();
    return user.userRoleId;
  }

  private async getUserRoleAsync(): Promise<any> {
    return await firstValueFrom(this.http.get<any>(`${this.baseUrl}/GetUser`));
  }
}
