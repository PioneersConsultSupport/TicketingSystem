import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  baseUrl = environment.apiUrl + "/user";
  constructor(private http: HttpClient) { }

  getAllUsers(){
      return this.http.get<any>(this.baseUrl);
  }

  addUserRole(roleId: number, userEmail: string){
      return this.http.post(this.baseUrl, { UserEmail: userEmail, UserRoleId: roleId });
  }

}
