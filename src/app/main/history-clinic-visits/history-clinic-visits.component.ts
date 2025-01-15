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

@Component({
  selector: 'app-history-clinic-visits',
  templateUrl: './history-clinic-visits.component.html',
  styleUrls: ['./history-clinic-visits.component.css']
})
export class HistoryClinicVisitsComponent implements OnInit {

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
  manPhone : new FormControl(""),
  womanPhone:new FormControl("")  
})
newSummonsClinicVisitsComponent(){
  this._router.navigate(["main/clinicVisits"]);
}
edit(clinicVisits:ClinicVisitsDTO){
  let id=clinicVisits["clinicVisitsId"];
  this._router.navigate(["main/clinicVisits/"+id]);
}
searchBytreatmentName(){
  let string=this.summonsClinicVisitsform.controls["treatments"].value.toUpperCase();
  this.clinicVisitsListToDisplay=this.clinicVisitsList.filter(c=>c.treatments && c.treatments.treatmentName.includes(string))

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
  this.clinicVisitsListToDisplay=this.clinicVisitsList.filter(c=>c.persons && c.persons.familyName.includes(string))

}
searchBymanName(){
  let string=this.summonsClinicVisitsform.controls["manName"].value;
  this.clinicVisitsListToDisplay=this.clinicVisitsList.filter(c=>c.persons && c.persons.manName.includes(string))

}
searchBywomanName(){
  let string=this.summonsClinicVisitsform.controls["womanName"].value;
  this.clinicVisitsListToDisplay=this.clinicVisitsList.filter(c=>c.persons && c.persons.womanName.includes(string))

}
searchBymanId(){
  let string=this.summonsClinicVisitsform.controls["manId"].value;
  this.clinicVisitsListToDisplay=this.clinicVisitsList.filter(c=>c.persons && c.persons.manId.toString().includes(string))

}
searchBywomanId(){
  let string=this.summonsClinicVisitsform.controls["womanId"].value;
  this.clinicVisitsListToDisplay=this.clinicVisitsList.filter(c=>c.persons && c.persons.womanId.toString().includes(string))

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
constructor(private _personsService:PersonsService,private _cinicVisitsService:ClinicVisitsService
  ,private _EmployeesService: EmployeesService,private _router:Router){}
  ngOnInit() {
    // this._personsService.getAll().subscribe(
    //   (data)=>{
    //     this.persons=data;
    //     },
    //  (error)=>{ alert("try later");}

    // )
    this._EmployeesService.getAll().subscribe(
      (data)=>{
     
        this.allEmployees=data;
        
        },
     (error)=>{ 
      alert("error")
     }  ) 
    
this._cinicVisitsService.getByFlag(true).subscribe(
      (data)=>{
        debugger
        // data.sort(function(a,b){
        //   // Turn your strings into dates, and then subtract them
        //   // to get a value that is either negative, positive, or zero.
        //   return new Date(b.visitsDate) - new Date(a.visitsDate);
        // });
        // this.clinicVisitsList=data.reverse();
        this.clinicVisitsList=data.sort(
          (objA, objB) => new Date(objA.visitsDate).getTime()- new Date(objB.visitsDate).getTime(),
        );
        this.clinicVisitsListToDisplay= this.clinicVisitsList.reverse();
        },
     (error)=>{ alert("try later");})
    // this.clinicVisitsList=this.tmpdata;
  }

}
