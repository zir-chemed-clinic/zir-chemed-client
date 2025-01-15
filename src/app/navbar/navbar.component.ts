import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '../permission.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  director:boolean=this._PermissionService.director;
  employee:boolean=this._PermissionService.employee;
  constructor(private _router: Router,private _PermissionService:PermissionService) { }
  signOut(){
    this.director=false;
    this.employee=false;
    this._PermissionService.setPermission(false);
    this._PermissionService.setPermissionEmployee(false)
    this._router.navigate(["auth"]);
  }
  toDirector(){
    this.director=this._PermissionService.director;
    this.employee=this._PermissionService.employee;
  }
  toEmployee(){
this.employee=this._PermissionService.employee;
  }
  toClinicVisits(){
    this._router.navigate(["main/summonsClinicVisits"]);
  }
  toHistoryClinicVisits(){
    this._router.navigate(["main/historyClinicVisits"]);
  }
  toUsers(){
    this._router.navigate(["auth/allUsers"]);
  }
  toPrsonse(){
    this._router.navigate(["main/allPersons"]);
  }
  toEmploees(){
    this._router.navigate(["main/allEmployees"]);
  }
  toTreatments(){
    this._router.navigate(["main/allTreatments"]);
  }
  toSummary(){
    this._router.navigate(["main/summary"]);
  }

   ngOnInit() {
  }
  

}
