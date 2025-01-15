import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../models/User';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  toggleLayer:boolean=false;
  userId:number;
  user:User;
  userToSave:User;
  userform=new FormGroup({
    userName :  new FormControl("",[Validators.required]),
   userPassword: new FormControl("",[Validators.required]),
   user: new FormControl(false),
   director: new FormControl(false)
  })
  setUser(user:User){
    this.userform.controls["userName"].setValue(user.userName);
    this.userform.controls["userPassword"].setValue(user.userPassword);
    if(user.userPermission==1){
      this.userform.controls["director"].setValue(true);
    }
    else{
      this.userform.controls["user"].setValue(true);
    }
  }

  saveUaer(){
    this.toggleLayer=true;
    this.userToSave=new User();
    this.userToSave.userId=this.userId;
    this.userToSave.userName=this.userform.controls["userName"].value;
    this.userToSave.userPassword=this.userform.controls["userPassword"].value;
    if(this.userform.controls["user"].value==true){
      this.userToSave.userPermission=2
    }
    if(this.userform.controls["director"].value==true){
      this.userToSave.userPermission=1
    }
    this._userService.saveUser(this.userToSave).subscribe(
      (data)=>{
        this._router.navigate(["auth/allUsers"]);
        this.toggleLayer=false;
      
        },
     (error)=>{ 
      this.toggleLayer=false;
       alert("try later");}

    )
  }
  constructor(private _userService:UserService,private _acr:ActivatedRoute,private _router :Router) { }


  ngOnInit() {
    this._acr.params.subscribe(
      (params: Params) => {
       this.userId=+params.userId;
      }
    )
    if(this.userId){
     

      this._userService.getById(this.userId).subscribe(
        (data)=>{
          this.user=data;
          this.setUser(this.user);
        
        },
        (error)=>{
          alert("try later")

        }
      )
    }
    else{
      this.userId=0;
    }
  }

}
