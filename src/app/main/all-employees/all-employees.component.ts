import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeesService } from '../services/employees.service';
import { EmployeesDTO } from '../models/EmployeesDTO';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.css']
})
export class AllEmployeesComponent implements OnInit {

  allEmployees:EmployeesDTO[];
  newEmployees(){
    this._router.navigate(["main/employees"]);
    }
    edit(employees:EmployeesDTO){
      let id=employees["employeeId"];
      this._router.navigate(["main/employees/"+id]);
    }
    salary(employees:EmployeesDTO){
      let id=employees["employeeId"];
      this._router.navigate(["main/employeeSalary/"+id]);
    }


  constructor(private _employeesService:EmployeesService,private _router: Router) { }

  ngOnInit() {
    this._employeesService.getAll().subscribe(
      (data)=>{
        this.allEmployees=data;
        },
     (error)=>{ alert("try later");})

  }

}
