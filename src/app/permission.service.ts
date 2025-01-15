import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
 public director:boolean=false;
 public employee:boolean=false;
 setPermission(permission:boolean){
   this.director=permission;

 }
 setPermissionEmployee(permission:boolean){
  this.employee=permission;

}
  constructor() { }
}
