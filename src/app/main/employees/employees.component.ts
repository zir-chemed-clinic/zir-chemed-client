import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../services/employees.service';
import { EmployeesDTO } from '../models/EmployeesDTO';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  EmployeesToSave:EmployeesDTO;
  toggleLayer:boolean=false;
  employeesId:number;
  employeesToEdit:EmployeesDTO;
  employeesform=new FormGroup({
    EmployeeIdNumber: new FormControl("",[Validators.required]),
    EmployeeName :  new FormControl("",[Validators.required]),
    EmployeePhone : new FormControl("",[Validators.required]),
    EmployeePermission : new FormControl(""),
    Preformed : new FormControl(false),
    Doctor : new FormControl(false),
    Degree : new FormControl(""),
    EmployeEemail : new FormControl("",[Validators.email]),
    EmployeePassword : new FormControl(""),
    DoctorLicenseNumber : new FormControl(""),
    LicenseNumber : new FormControl(""),
    SpecializedLicenseNumber: new FormControl(""),
    PaymentForSA : new FormControl(""),
    PaymentForIUI : new FormControl(""),
    PaymentForPCT : new FormControl(""),
    PaymentForInsemination : new FormControl(""),
    PaymentForWash : new FormControl(""),
    PaymentForConsulting : new FormControl(""),
    PaymentForIUISA : new FormControl(""),
    PaymentForcanNotBeMadeIUI  : new FormControl(""),
    PaymentForCanNotBeMadeSA  : new FormControl(""),
    PaymentForMorphology: new FormControl("")
  })
  setEmployees(employees){
    this.employeesform.controls["EmployeeIdNumber"].setValue(employees.employeeIdNumber);
    this.employeesform.controls["EmployeeName"].setValue(employees.employeeName);
    this.employeesform.controls["EmployeePhone"].setValue(employees.employeePhone);
    // this.employeesform.controls["EmployeePermission"].setValue(employees.EmployeePermission);
    this.employeesform.controls["Degree"].setValue(employees.degree);
    this.employeesform.controls["EmployeEemail"].setValue(employees.employeEemail);
    this.employeesform.controls["EmployeePassword"].setValue(employees.employeePassword);
    this.employeesform.controls["DoctorLicenseNumber"].setValue(employees.doctorLicenseNumber);
    this.employeesform.controls["LicenseNumber"].setValue(employees.licenseNumber);
    this.employeesform.controls["SpecializedLicenseNumber"].setValue(employees.specializedLicenseNumber);
    this.employeesform.controls["PaymentForSA"].setValue(employees.paymentForSA);
    this.employeesform.controls["PaymentForIUI"].setValue(employees.paymentForIUI);
    this.employeesform.controls["PaymentForPCT"].setValue(employees.paymentForPCT);
    this.employeesform.controls["PaymentForInsemination"].setValue(employees.paymentForInsemination);
    this.employeesform.controls["PaymentForWash"].setValue(employees.paymentForWash);
    this.employeesform.controls["PaymentForConsulting"].setValue(employees.paymentForConsulting);
    this.employeesform.controls["PaymentForIUISA"].setValue(employees.paymentForIUISA);
    this.employeesform.controls["PaymentForcanNotBeMadeIUI"].setValue(employees.paymentForcanNotBeMadeIUI);
    this.employeesform.controls["PaymentForCanNotBeMadeSA"].setValue(employees.paymentForCanNotBeMadeSA);
    this.employeesform.controls["PaymentForMorphology"].setValue(employees.paymentForMorphology);
    if(employees.role==3 ){
      this.employeesform.controls['Preformed'].setValue(true);
      this.employeesform.controls['Doctor'].setValue(true);
    }
    else if(employees.role==2){
      this.employeesform.controls['Preformed'].setValue(true);

    }
    else{
      this.employeesform.controls['Doctor'].setValue(true);

    }

  }
  saveEmployees(){
    this.toggleLayer=true;

    this.EmployeesToSave=new EmployeesDTO();
    // this.EmployeesToSave=this.employeesform.value;
    if(this.employeesId){
      this.EmployeesToSave.employeeId=+this.employeesId;
    }
    else{
      this.EmployeesToSave.employeeId=0;
    }
    this.EmployeesToSave.employeeIdNumber=+this.employeesform.controls["EmployeeIdNumber"].value;
    if(this.employeesform.controls['Preformed'].value==true && this.employeesform.controls['Doctor'].value==true){
      this.EmployeesToSave.role=3
    }
    else if(this.employeesform.controls['Preformed'].value==true){
      this.EmployeesToSave.role=2

    }
    else{
      this.EmployeesToSave.role=1

    }
    this.EmployeesToSave.employeeName= this.employeesform.controls["EmployeeName"].value;
    this.EmployeesToSave.employeePhone=this.employeesform.controls["EmployeePhone"].value;
    this.EmployeesToSave.employeePermission=+this.employeesform.controls["EmployeePermission"].value;
    this.EmployeesToSave.degree="  ";
    this.EmployeesToSave.employeEemail=this.employeesform.controls["EmployeEemail"].value;
    this.EmployeesToSave.employeePassword=this.employeesform.controls["EmployeePassword"].value;
    this.EmployeesToSave.doctorLicenseNumber=+this.employeesform.controls["DoctorLicenseNumber"].value;
    this.EmployeesToSave.licenseNumber=+this.employeesform.controls["LicenseNumber"].value;
    this.EmployeesToSave.specializedLicenseNumber=+this.employeesform.controls["SpecializedLicenseNumber"].value;
    
    this.EmployeesToSave.paymentForSA= +this.employeesform.controls["PaymentForSA"].value;
    this.EmployeesToSave.paymentForIUI= +this.employeesform.controls["PaymentForIUI"].value;
    this.EmployeesToSave.paymentForPCT= +this.employeesform.controls["PaymentForPCT"].value;
    this.EmployeesToSave.paymentForInsemination= +this.employeesform.controls["PaymentForInsemination"].value;
    this.EmployeesToSave.paymentForWash= +this.employeesform.controls["PaymentForWash"].value;
    this.EmployeesToSave.paymentForConsulting= +this.employeesform.controls["PaymentForConsulting"].value;
    this.EmployeesToSave.paymentForIUISA= +this.employeesform.controls["PaymentForIUISA"].value;
    this.EmployeesToSave.paymentForcanNotBeMadeIUI= +this.employeesform.controls["PaymentForcanNotBeMadeIUI"].value;
    this.EmployeesToSave.paymentForCanNotBeMadeSA= +this.employeesform.controls["PaymentForCanNotBeMadeSA"].value;
    this.EmployeesToSave.paymentForMorphology= +this.employeesform.controls["PaymentForMorphology"].value;
    // this.employeesform.controls["Degree"].setValue(employees.Degree);
   
    
   
    // גם וגם שווה 3 איש מעבדה שווה 2 רופא שווה 1
   
    
    this._EmployeesService.saveEmployees(this.EmployeesToSave).subscribe(
      (data)=>{
        this.toggleLayer=false;
        this._router.navigate(["main/allEmployees"]);
        },
     (error)=>{ 
      this.toggleLayer=false;
       alert("try later");}

    )
  }


  constructor(private _EmployeesService:EmployeesService,private _acr:ActivatedRoute,private _router :Router) { }

  ngOnInit() {
    this._acr.params.subscribe(
      (params: Params) => {
        this.employeesId=params.employeesId;
      }
    )
    // this.parmasSubscription = this._acr.paramMap.subscribe(params => {
    //   this.personsId = +(params["params"].personsId)});
      if(this.employeesId){
        this._EmployeesService.getById(this.employeesId).subscribe(
          (data)=>{
            this.employeesToEdit=data;
            this.setEmployees(this.employeesToEdit);
          },
          (error)=>{
            alert("try later")

          }
        )
        
      }
  }

}
