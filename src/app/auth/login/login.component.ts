import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PermissionService } from 'src/app/permission.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginform=new FormGroup({
    userName :  new FormControl("",[Validators.required]),
   userPassword: new FormControl("",[Validators.required]),
   user:new  FormControl(false),
   directore:new  FormControl(false)
  })
  login(){
    let userName=this.loginform.controls["userName"].value
    let password=this.loginform.controls["userPassword"].value
    this._UserService.getUser(userName,password).subscribe(
      (data)=>{
        if(data){
        if(data.userPermission==1){
          this._PermissionService.setPermission(true)
          this._PermissionService.setPermissionEmployee(true);
         
        }
        else
        this._PermissionService.setPermission(false);
        this._PermissionService.setPermissionEmployee(true);
        this._router.navigate(["main/summonsClinicVisits"]);
      }
      },
      (err)=>{
        alert("try later");

      }
    )
   
  }
  constructor(private _UserService:UserService,private _PermissionService:PermissionService,private _router :Router ) { }

  ngOnInit() {
  }

}
