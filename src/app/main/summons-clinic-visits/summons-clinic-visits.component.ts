import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PersonsService } from '../services/persons.service';
import { PersonsDTO } from '../models/PersonsDTO';
import { ClinicVisitsDTO } from '../models/ClinicVisitsDTO';
import { ClinicVisitsService } from '../services/clinic-visits.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeesService } from '../services/employees.service';
import { EmployeesDTO } from '../models/EmployeesDTO';
import { PermissionService } from 'src/app/permission.service';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';

@Component({
  selector: 'app-summons-clinic-visits',
  templateUrl: './summons-clinic-visits.component.html',
  styleUrls: ['./summons-clinic-visits.component.css']
})
export class SummonsClinicVisitsComponent implements OnInit {

  // manId:number;
  // womanId:number;
  // persons:PersonsDTO[]=[];
  // personChoose:PersonsDTO;

  // SearchByMan(){
  // this.personChoose= this.persons.find(p=>p.ManId==this.manId);
  // }
  // SearchByWoman(){
  //   this.personChoose= this.persons.find(p=>p.WomanId==this.womanId);
  // }
  
  director:boolean=false;
  treatments:string="";
  toggleLayer:boolean=false;
  preformed:string="";
  doctor:string="";
  familyName:string="";
  manName : string="";
  womanName :string="";
  manId:string="";
  womanId:string="";
  fromDate:Date;
  untilDate:Date;
  apartmentHr:boolean=false;
  apartmentVy:boolean=false;
  apartmentYy:boolean=false;
displayedColumns: string[] = ['TreatmentsId', 'PersonsId', 'Preformed', 'Doctor','PaymentMethod','Receipt','Amount','VisitsDate'];
clinicVisitsList:ClinicVisitsDTO[]=[];
allEmployees:EmployeesDTO[]=[];
clinicVisitsListToDisplay:ClinicVisitsDTO[]=[];
summonsClinicVisitsform=new FormGroup({
  treatments :  new FormControl(""),
  preformed : new FormControl(""),
  doctor : new FormControl(""),
  familyName : new FormControl(""),
  // time:new FormControl(""),
  manName : new FormControl(""),
  womanName : new FormControl(""),
  manId : new FormControl(""),
  womanId : new FormControl(""),
  fromDate : new FormControl(""),
  untilDate : new FormControl(""),
  apartmentVy : new FormControl(""),
  apartmentYy : new FormControl(""),
  apartmentHr : new FormControl(""),
  manPhone : new FormControl(""),
  womanPhone:new FormControl("")
})
displayDeleteDialog:boolean=false
clinicVisitIdToDelete:number
askToDelete:boolean=true
awaitingDeletion:boolean=false
successfullyDeleted:boolean=false
notDeleted:boolean=false
// flagdoctor:boolean=false
// flagpreformed:boolean=false

newSummonsClinicVisitsComponent(){
  this._router.navigate(["main/clinicVisits"]);
}
edit(clinicVisits:ClinicVisitsDTO){
  let id=clinicVisits["clinicVisitsId"];
  this._router.navigate(["main/clinicVisits/"+id]);
}
deleteDialog(clinicVisits:ClinicVisitsDTO){
  let id=clinicVisits["clinicVisitsId"];
  this.clinicVisitIdToDelete=id;
  this.askToDelete=true
  this.awaitingDeletion=false
  this.successfullyDeleted=false
  this.notDeleted=false
  this.displayDeleteDialog=true;
}
delete(){
  if(this._PermissionService.director){
  this.askToDelete=false
  this.awaitingDeletion=true
  this._cinicVisitsService.deleteById(this.clinicVisitIdToDelete).subscribe(
    (data)=>{
      if(data){
      this.clinicVisitsList=this.clinicVisitsList.filter(c=>c.clinicVisitsId!=this.clinicVisitIdToDelete)
      this.clinicVisitsListToDisplay=this.clinicVisitsList
      // this.displayDeleteDialog=false
      this.awaitingDeletion=false
      this.successfullyDeleted=true

      }
      else{
        this.awaitingDeletion=false
        this.notDeleted=true
      }

    },
    (err)=>{
      // this.displayDeleteDialog=false
      this.awaitingDeletion=false
      this.notDeleted=true

    }
  )
}
}
searchBytreatmentName(){
  let string=this.summonsClinicVisitsform.controls["treatments"].value.toUpperCase();
  this.clinicVisitsListToDisplay=this.clinicVisitsList.filter(c=>c.treatments.treatmentName.includes(string))

}
searchBypreformedName(){
  let string=this.summonsClinicVisitsform.controls["preformed"].value;
  this.clinicVisitsListToDisplay=this.clinicVisitsList.filter(c=>c.preformedNavigation &&c.preformedNavigation.employeeName.includes(string))

}
searchBydoctorName(){
  let string=this.summonsClinicVisitsform.controls["doctor"].value;
  this.clinicVisitsListToDisplay=this.clinicVisitsList.filter(c=>c.doctorNavigation&& c.doctorNavigation.employeeName.includes(string))

}
searchByfamilyName(){
  let string=this.summonsClinicVisitsform.controls["familyName"].value;
  this.clinicVisitsListToDisplay=this.clinicVisitsList.filter(c=>c.persons.familyName.includes(string))

}
searchBymanName(){
  let string=this.summonsClinicVisitsform.controls["manName"].value;
  this.clinicVisitsListToDisplay=this.clinicVisitsList.filter(c=>c.persons.manName.includes(string))

}
searchBywomanName(){
  let string=this.summonsClinicVisitsform.controls["womanName"].value;
  this.clinicVisitsListToDisplay=this.clinicVisitsList.filter(c=>c.persons.womanName.includes(string))

}
searchBymanId(){
  let string=this.summonsClinicVisitsform.controls["manId"].value;
  this.clinicVisitsListToDisplay=this.clinicVisitsList.filter(c=>c.persons.manId.toString().includes(string))

}
searchBywomanId(){
  let string=this.summonsClinicVisitsform.controls["womanId"].value;
  this.clinicVisitsListToDisplay=this.clinicVisitsList.filter(c=>c.persons.womanId.toString().includes(string))

}
searchByAll(){
  debugger
  // let womanId=this.summonsClinicVisitsform.controls["womanId"].value;
  // let manId=this.summonsClinicVisitsform.controls["manId"].value;
  let womanPhone =this.summonsClinicVisitsform.controls["womanPhone"].value; 
  let manPhone = this.summonsClinicVisitsform.controls["manPhone"].value;
  let womanName=this.summonsClinicVisitsform.controls["womanName"].value;
  let manName=this.summonsClinicVisitsform.controls["manName"].value;
  // let doctor=this.summonsClinicVisitsform.controls["doctor"].value;
  // let preformed=this.summonsClinicVisitsform.controls["preformed"].value;
  let treatments=this.summonsClinicVisitsform.controls["treatments"].value.toUpperCase();
  let familyName=this.summonsClinicVisitsform.controls["familyName"].value;
  this.clinicVisitsListToDisplay=this.clinicVisitsList.filter(c=>c.persons.womanPhone.toString().includes(womanPhone)
 && c.persons.manPhone.toString().includes(manPhone) &&  c.persons.womanName.toString().includes(womanName)
 &&  c.persons.manName.toString().includes(manName) && c.treatments.treatmentName.includes(treatments)
 && c.persons.familyName.includes(familyName))
//  &&(this.flagdoctor==false || c.doctorNavigation&& c.doctorNavigation.employeeName.includes(doctor))
//  && (this.flagpreformed==false || c.preformedNavigation.employeeName.includes(preformed))
 }
 createExelFile(){
     let workbook = new Excel.Workbook();
     let worksheet = workbook.addWorksheet("appointments");
     let header=["שם משפחה","שם הבעל","שם האשה","טלפון הבעל","טלפון האשה","סוג טיפול","רופא","עובד מעבדה","הזמינו דירה"
   ]
    
   let headerRow = worksheet.addRow(header);
   headerRow.font = { bold: true };
   for (let turn of this.clinicVisitsListToDisplay)
 {
   // let x2=Object.keys(x1);
   let row = [
    turn.persons.familyName,
    turn.persons.manName,
    turn.persons.womanName,
    turn.persons.manPhone,
    turn.persons.womanPhone,
    turn.treatments.treatmentName,
    turn.doctorNavigation && turn.doctorNavigation.employeeName ? turn.doctorNavigation.employeeName : '',
    turn.preformedNavigation && turn.preformedNavigation.employeeName ? turn.preformedNavigation.employeeName : '', 
    turn.apartmentHr || turn.apartmentVy || turn.apartmentYy ? '✔' : '✘'
  ];
  
  
   // for(let y of x2)
   // {
   //   temp.push(x1[y])
   // }
   worksheet.addRow(row)
 }
 let fname="תורים פתוחים"
 let dtae = new Date();
 let dd = String(dtae.getDate()).padStart(2, '0');
 let mm = String(dtae.getMonth() + 1).padStart(2, '0'); //January is 0!
 let yyyy = dtae.getFullYear();
 
 let today = dd + '.' + mm + '.' + yyyy;
 // add data and file name and download
 workbook.xlsx.writeBuffer().then((data) => {
   let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
   fs.saveAs(blob, fname+'-'+today+'.xlsx');
 });}

constructor(private _personsService:PersonsService,private _cinicVisitsService:ClinicVisitsService
  ,private _EmployeesService: EmployeesService,private _router:Router,private _PermissionService:PermissionService){}
  ngOnInit() {
    // this._personsService.getAll().subscribe(
    //   (data)=>{
    //     this.persons=data;
    //     },
    //  (error)=>{ alert("try later");}

    // )
    this.director= this._PermissionService.director;
    this._EmployeesService.getAll().subscribe(
      (data)=>{
     
        this.allEmployees=data;
        },
     (error)=>{ 
      alert("error")
     } 
     
      ) 
    
this._cinicVisitsService.getByFlag(false).subscribe(
      (data)=>{
        // data.sort(function(a,b){
        //   // Turn your strings into dates, and then subtract them
        //   // to get a value that is either negative, positive, or zero.
        //   return new Date(b.visitsDate) - new Date(a.visitsDate);
        // });
        this.clinicVisitsList=data;
        this.clinicVisitsList=data.sort(
          (objA, objB) => new Date(objA.visitsDate).getTime()- new Date(objB.visitsDate).getTime(),
        );
        this.clinicVisitsListToDisplay= this.clinicVisitsList;
        },
     (error)=>{ alert("try later");})
    // this.clinicVisitsList=this.tmpdata;
  }

}
