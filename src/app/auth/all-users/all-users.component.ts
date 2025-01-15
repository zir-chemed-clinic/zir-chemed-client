import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../models/User';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {
  allUsers:User[];
  newUser(){
    this._router.navigate(["auth/user"]);
    }
    edit(user:User){
      let id=user["userId"];
      this._router.navigate(["auth/user/"+id]);
    }
    delete(user:User){
      let p=user["userPermission"];
      if(p!=1){
      let id=user["userId"];
      this._userService.deleteUser(id).subscribe(
        (data)=>{
         this.allUsers=this.allUsers.filter(u=>u.userId!=data.userId)
        }
        ,
        (err)=>{
          alert("try later");
        }
      )
    }
    }

  constructor(private _userService:UserService,private _router: Router) { }

  ngOnInit() {
    this._userService.getAll().subscribe(
      (data)=>{
        this.allUsers=data;
        },
     (error)=>{ alert("try later");})
  }

}
