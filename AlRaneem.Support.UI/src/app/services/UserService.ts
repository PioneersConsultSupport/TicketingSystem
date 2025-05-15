import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  baseUrl = "UserRole";
  constructor(private http: HttpClient) { }

  getAllUsers(){
      return this.http.get<any>(this.baseUrl + '/AllUsers');
  }

  addUserRole(roleId: number, userEmail: string){
      return this.http.post(this.baseUrl, { UserEmail: userEmail, UserRoleId: roleId });
  }

  updateUserRole(id: number, roleId: number, userEmail: string){
      return this.http.put(this.baseUrl, { UserEmail: userEmail, UserRoleId: roleId, Id: id });
  }

  deleteUserRole(id: number, roleId: number, userEmail: string){
      return this.http.post(this.baseUrl + '/Delete', { UserEmail: userEmail, UserRoleId: roleId, Id: id });
  }

  getAllUsersRoles(){
      return this.http.get<any>(this.baseUrl);
  }
}
