import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PersonsService } from '../services/persons.service';
import { PersonsDTO } from '../models/PersonsDTO';
import { Observable } from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EmployeesService } from '../services/employees.service';
import { EmployeesDTO } from '../models/EmployeesDTO';
import { ClinicVisitsService } from '../services/clinic-visits.service';
import { TreatmentsDTO } from '../models/TreatmentsDTO';
// import { TreatmentService } from '../services/treatment.service';
import { ClinicVisitsDTO } from '../models/ClinicVisitsDTO';
import { TreatmentsService } from '../services/treatments.service';
import { Time } from '@angular/common';
import { PermissionService } from 'src/app/permission.service';
import { IuiService } from '../services/iui.service';
import { IuiDTO } from '../models/IuiDTO';
import { InseminationDTO } from '../models/InseminationDTO';
import { InseminationService } from '../services/insemination.service';
import { lookup } from 'dns';

@Component({
  selector: 'app-clinic-visits',
  templateUrl: './clinic-visits.component.html',
  styleUrls: ['./clinic-visits.component.css']
})
export class ClinicVisitsComponent implements OnInit {
  @Input() clinicVisitsIdInput: number;
  personsIdToEdit:number;
  director: boolean=false;
  displayResponsive:boolean=false;
  toggleLayer:boolean=false;
  flagInDialog:boolean=false;
  flagEdit:boolean=false;
  flagForm:boolean=false;
  flagKindTreatment:boolean=false;
  flagPayment:boolean=false;
  flagClinicVisits:boolean=true;
  flagInsemination:boolean=false;
  flagDidNotArrive:boolean=false;
  flagIui:boolean=false;
  flagPct:boolean=false;
  flagSa:boolean=false;
  flagIUISA:boolean=false;
  flagSign:boolean=false;
  allPersons:PersonsDTO[]=[];
  allEmployees:EmployeesDTO[]=[];
  allTreatments:TreatmentsDTO[]=[];
  PaymentMethod:string[]=["credit","cash","check","העברה בנקאית"]
  filteredPersons: Observable<string[]>;
  filteredEmplyees: Observable<string[]>;
  clinicVisitToSave:ClinicVisitsDTO=new ClinicVisitsDTO();
  theClinicVisit:ClinicVisitsDTO;
  clinicVisitsId:number=0;
  signature:string="";
  clinicVisitsIdEdit:number;
  clinicVisitsToEdit:ClinicVisitsDTO;
  allPreformed:EmployeesDTO[]=[];
  allDoctor:EmployeesDTO[]=[]; 
  displayFolliclesNumber:boolean=false;
  flagNeedSaveFolliclesNumber:boolean=false;
  clinicVisitsform=new FormGroup({
    TreatmentsId :  new FormControl("",[Validators.required]),
    manId : new FormControl("",[Validators.required]),
    Preformed : new FormControl(""),
    Doctor : new FormControl(""),
    Morphology:new FormControl(""),
    PaymentMethod : new FormControl(""),
    Receipt : new FormControl(""),
    C : new FormControl(false),
    Co : new FormControl(false),
    done: new FormControl(false),
    doneDoctor:new FormControl(false),
    doneMorphology:new FormControl(false),
    didNotArrive:new FormControl(false),
    Amount : new FormControl(""),
    Subsidization : new FormControl(false),
    VisitsDate:new FormControl("",[Validators.required]),
    person:new FormControl(""),
    time:new FormControl(""),
    apartmentHr:new FormControl(false),
    apartmentVy:new FormControl(false),
    apartmentYy:new FormControl(false),
    visitTime:new FormControl("")
  })

 paymentform=new FormGroup({
    PaymentMethod : new FormControl(""),
    Receipt : new FormControl(""),
    Amount : new FormControl(""),
    SubsidizationApprove: new FormControl(false),
    SubsidizationAmount: new FormControl(""),
    CheckNumber: new FormControl(""),
    Subsidization: new FormControl(false)
  })
  folliclesFrom=new FormGroup({
    folliclesNumber:new FormControl("")
  })

  
  saveClinicVisits(){
    debugger
    this.toggleLayer=true;
   // console.log(this.theClinicVisit.signature);
   console.log("save");
   
console.log(this.signature);
    this.signature=this.clinicVisitToSave.signature;
    // this.t=this.clinicVisitsform.controls["time"].value;
    // let h=this.t.hours;
    // let m=this.t.minutes;
  //   let arr=this.clinicVisitsform.controls["time"].value.split(":");
  //  let h= +arr[0];
  //  let m = +arr[1];
  let treatments=this.clinicVisitsform.controls["TreatmentsId"].value;
  if(treatments)
   this.clinicVisitToSave.treatmentsId=+treatments.treatmentId;
    if(this.clinicVisitsId!=0){
      this.clinicVisitToSave.clinicVisitsId=+this.clinicVisitsId;
      if(this.clinicVisitToSave.treatmentsId==this.theClinicVisit.treatmentsId){
        this.clinicVisitToSave.closedSA=this.theClinicVisit.closedSA
        this.clinicVisitToSave.closedIUI=this.theClinicVisit.closedIUI
        this.clinicVisitToSave.closed=this.theClinicVisit.closed
      }
    }
    if(treatments.treatmentName == "לא ניתן לבצע בדיקת זרע" || treatments.treatmentName == "לא ניתן לבצע השבחה" ){
      this.clinicVisitToSave.closed=true
     }
    if(treatments){
    let nameTreatments=this.allTreatments.filter(t=>t.treatmentId== this.clinicVisitToSave.treatmentsId);
    if(nameTreatments[0].treatmentName=="IUI" || nameTreatments[0].treatmentName=="IUI + SA"){
      // בדיקה האם מדובר בקביעת התור הראשונה או שהתור השתנה להזרעה כדי לדעת האם להקפיץ את השדה מספר זקיקים
      let nameLastTreatments;
      if(this.clinicVisitsId!=0){
      nameLastTreatments=this.allTreatments.filter(t=>t.treatmentId== this.theClinicVisit.treatmentsId);
      }
      if(this.clinicVisitsId==0 || (nameLastTreatments && nameLastTreatments[0].treatmentName !="IUI" && nameLastTreatments[0].treatmentName !="IUI + SA") ){
          if(this.folliclesFrom.controls["folliclesNumber"].value!=""){
            // יש לשמור את השדה מספר זקיקים לאחר שמירת התור
            this.flagNeedSaveFolliclesNumber=true
          }
          else{
            this.toggleLayer=false;
            this.displayFolliclesNumber=true
            return;
          }
      }
    
    }
  }

   let persons=this.allPersons.filter(p=>p.manId==this.clinicVisitsform.controls["manId"].value)[0];
   if(persons)
    this.clinicVisitToSave.personsId=+persons.personsId;
  //  let preformed=this.allEmployees.filter(emp=>emp.EmployeeName==this.clinicVisitsform.controls["Preformed"].value)[0];
  //  this.clinicVisitToSave.Preformed=preformed.EmployeeId;
  //  let doctor=this.allEmployees.filter(emp=>emp.EmployeeName==this.clinicVisitsform.controls["Doctor"].value)[0];
  //  this.clinicVisitToSave.Doctor=doctor.EmployeeId;
   let preformed=this.clinicVisitsform.controls["Preformed"].value;
   if(preformed)
    this.clinicVisitToSave.preformed=+preformed.employeeId;
   let doctor=this.clinicVisitsform.controls["Doctor"].value;
   if(doctor)
    this.clinicVisitToSave.doctor=+doctor.employeeId;

    let morphology=this.clinicVisitsform.controls["Morphology"].value;
    if(morphology)
     this.clinicVisitToSave.morphology=+morphology.employeeId;
   this.clinicVisitToSave.paymentMethod=this.clinicVisitsform.controls["PaymentMethod"].value;
   this.clinicVisitToSave.receipt=+this.clinicVisitsform.controls["Receipt"].value;
   this.clinicVisitToSave.c=this.clinicVisitsform.controls["C"].value;
   this.clinicVisitToSave.co=this.clinicVisitsform.controls["Co"].value;
   this.clinicVisitToSave.done=this.clinicVisitsform.controls["done"].value;
   this.clinicVisitToSave.doneDoctor=this.clinicVisitsform.controls["doneDoctor"].value;
   this.clinicVisitToSave.doneMorphology=this.clinicVisitsform.controls["doneMorphology"].value; 
 
   this.clinicVisitToSave.apartmentHr=this.clinicVisitsform.controls["apartmentHr"].value; 
   this.clinicVisitToSave.apartmentVy=this.clinicVisitsform.controls["apartmentVy"].value; 
   this.clinicVisitToSave.apartmentYy=this.clinicVisitsform.controls["apartmentYy"].value; 

   this.clinicVisitToSave.didNotArrive=this.clinicVisitsform.controls["didNotArrive"].value; 
   if(this.clinicVisitToSave.didNotArrive)
   {
     this.clinicVisitToSave.closed=true;
   }
   
  //  חישוב העלות כדי לשמור עבור הפעמיים הבאות
   let treatmentPayment=this.clinicVisitsform.controls["TreatmentsId"].value;
   let treatmentCost=treatmentPayment.treatmentCost;
   let amount = 0;
   if(this.clinicVisitsform.controls["C"].value==true){
     
     let cTreatments=this.allTreatments.filter(t=>t.treatmentName=="C")[0].treatmentCost;
     amount+=cTreatments

   } 
  //  this.clinicVisitToSave.amount=+this.clinicVisitsform.controls["Amount"].value;
  this.clinicVisitToSave.amount= treatmentCost+amount
 
   this.clinicVisitToSave.subsidization=this.clinicVisitsform.controls["Subsidization"].value;
   this.clinicVisitToSave.visitsDate=this.clinicVisitsform.controls["VisitsDate"].value; 
   let m=this.clinicVisitToSave.visitsDate.getMonth();
   let time=this.clinicVisitToSave.visitsDate.getHours();
   let typeTime=this.clinicVisitToSave.visitsDate.toString()
   if (typeTime.indexOf('חורף') > -1)
   {
    let h=(time+3)%24;
    this.clinicVisitToSave.visitsDate.setHours(h-1);
    //  שעון קיץ
    if(time>20)
   {
    this.clinicVisitToSave.visitsDate.setDate(this.clinicVisitToSave.visitsDate.getDate() + 1);
   }
  
   }
   else{
    let h=(time+3)%24;
    this.clinicVisitToSave.visitsDate.setHours(h);
    //  שעון קיץ
    if(time>21)
   {
    this.clinicVisitToSave.visitsDate.setDate(this.clinicVisitToSave.visitsDate.getDate()+2);
   }
   }
  //  להוריד
   debugger
   this.clinicVisitToSave.visitsDate=this.clinicVisitsform.controls["VisitsDate"].value
   this.clinicVisitToSave.visitTime=this.clinicVisitsform.controls["visitTime"].value
   
   
//    DateFormat timeFormat = new SimpleDateFormat("HH:mm");
// timeFormat.setTimeZone(TimeZone.getTimeZone("Asia/Jerusalem"));
// String curTime = timeFormat.format(new Date());

//  let t=this.clinicVisitsform.controls["time2"].value
//    this.clinicVisitToSave.visitsDate=this.clinicVisitsform.controls["VisitsDate"].value; 
//    this.clinicVisitToSave.visitsDate.setHours(t.getHours())
//    this.clinicVisitToSave.visitsDate.setMinutes(t.getMinutes())
  //  this.clinicVisitToSave.visitsDate=  new Date(Date.UTC(this.clinicVisitsform.controls["VisitsDate"].value.year,
  //  this.clinicVisitsform.controls["VisitsDate"].value.month,this.clinicVisitsform.controls["VisitsDate"].value.day
  //  ,this.clinicVisitsform.controls["VisitsDate"].value.hour, this.clinicVisitsform.controls["VisitsDate"].value.minute))
  
  //  if(m>10 || (m==10 && this.clinicVisitToSave.visitsDate.getDate()==31)){
  //   // if(time<24){
  //     //שעון חורף
  //     let h=(time+2)%24;
  //     this.clinicVisitToSave.visitsDate.setHours(h);
  //     if(time>21)
  //     {
  //      this.clinicVisitToSave.visitsDate.setDate(this.clinicVisitToSave.visitsDate.getDate() + 1);
  //     }
  //   //  }
  //  }
  // else{
     // שעון קיץ
 
  //  }
  
 this.clinicVisitToSave.signature=this.signature;
  //  this.clinicVisitToSave.visitsDate.setHours(h,m)
   this._ClinicVisitsService.saveClinicVisit(this.clinicVisitToSave).subscribe(
     (data)=>{
       this.theClinicVisit=data;

       
       this.clinicVisitsId= this.theClinicVisit.clinicVisitsId;
       this.flagForm=true;
       if(this.theClinicVisit.treatmentsId==1||this.theClinicVisit.treatmentsId==2||this.theClinicVisit.treatmentsId==4||this.theClinicVisit.treatmentsId==7)
     this.flagKindTreatment=true;
    else this.flagKindTreatment=false;
        // אם צריך לשמור את השדה מספר זקיקים
       if(this.flagNeedSaveFolliclesNumber==true){
         debugger
         // שמירת השדה בהזרעה וב Insermination
         // בדיקת מקרה קצה שהבדיקה כבר היתה בעבר הזרעה ועכשיו שוב ולכן היא קיימת ולא צריך ליצור אותה מחדש
          let iuiToSave= new IuiDTO();
         this._IuiService.getByClinicVisitId(this.clinicVisitsId).subscribe(
          (data)=>{
            if(data){
              iuiToSave=data
              iuiToSave.folliclesNumber=this.folliclesFrom.controls["folliclesNumber"].value;
            }
            else{
            iuiToSave.clinicVisitsId=this.clinicVisitsId;
            iuiToSave.folliclesNumber=this.folliclesFrom.controls["folliclesNumber"].value;
            // מניעת תקלות בשדות עם ערך NULL
            iuiToSave.other="";
            iuiToSave.doctorTreatment="";
            iuiToSave.givingTimeString="";
            iuiToSave.volumeCc="";
            iuiToSave.appearance="";
            iuiToSave.conc105cc="";
            iuiToSave.motility="";
            iuiToSave.motility_rank_1="";
            iuiToSave.motility_rank_2="";
            iuiToSave.motility_rank_3="";
            iuiToSave.motility_rank_4="";
            iuiToSave.grade="";
            iuiToSave.comments="";
            iuiToSave.volumeCcAfterTreatment="";
            iuiToSave.conc105ccAfterTreatment="";
            iuiToSave.motilityAfterTreatment="";
            iuiToSave.motilityAfterTreatment_1="";
            iuiToSave.motilityAfterTreatment_2="";
            iuiToSave.motilityAfterTreatment_3="";
            iuiToSave.motilityAfterTreatment_4="";
            iuiToSave.gradeAfterTreatment="";
            iuiToSave.totalMotileCount="";
            iuiToSave.emailForSendingResults="";
            iuiToSave.commentsTreatment=""
          }
            this._IuiService.saveIui(iuiToSave).subscribe(
              (data)=>{
    
                },
             (error)=>{ 
               alert("לא ניתן לשמור כעת את מספר הזקיקים");}
        
            )
     
            },
         (error)=>{console.log(error)}
        )

        debugger
        let InseminationToSave= new InseminationDTO();
        this._InseminationService.getByClinicVisitId(this.clinicVisitsId).subscribe(
          (data)=>{
            if(data){
              InseminationToSave=data;
              InseminationToSave.folliclesNumber=+this.folliclesFrom.controls["folliclesNumber"].value;
            }
            else{
            InseminationToSave.clinicVisitsId=this.clinicVisitsId;
            InseminationToSave.folliclesNumber=+this.folliclesFrom.controls["folliclesNumber"].value;
            InseminationToSave.treatmentDescription=""
            InseminationToSave.treatmentsTime=""
          }

            this._InseminationService.saveInsemination(InseminationToSave).subscribe(
              (data)=>{
    
                },
             (error)=>{ 
               alert("לא ניתן לשמור כעת את מספר הזקיקים");}
        
            )
            },
         (error)=>{console.log(error)}
        )

        }
       this.toggleLayer=false;
     },
     (error)=>{
     
      // this.clinicVisitToSave.ClinicVisitsId=5;
      this.toggleLayer=false;
      alert("try later");
     }

   )

  }
  closeDisplayFolliclesNumber(){
    this.displayFolliclesNumber=false
    this.saveClinicVisits()
  }
  savePayment(){
    debugger
    this.toggleLayer=true;
    this.clinicVisitToSave=this.theClinicVisit;
    this.clinicVisitToSave.paymentMethod=this.paymentform.controls["PaymentMethod"].value;
    this.clinicVisitToSave.receipt=+this.paymentform.controls["Receipt"].value;
    this.clinicVisitToSave.amount=+this.paymentform.controls["Amount"].value;
    this.clinicVisitToSave.subsidization=this.paymentform.controls["Subsidization"].value;
    this.clinicVisitToSave.subsidizationAmount=this.paymentform.controls["SubsidizationAmount"].value;
    this.clinicVisitToSave.subsidizationApprove=this.paymentform.controls["SubsidizationApprove"].value;
    this.clinicVisitToSave.checkNumber=this.paymentform.controls["CheckNumber"].value;
    this._ClinicVisitsService.saveClinicVisit(this.clinicVisitToSave).subscribe(
      (data)=>{
        this.theClinicVisit=data;
        this.clinicVisitsId= this.theClinicVisit.clinicVisitsId;
        this.flagForm=true;
        if(this.theClinicVisit.treatmentsId==1||this.theClinicVisit.treatmentsId==2||this.theClinicVisit.treatmentsId==4||this.theClinicVisit.treatmentsId==7)
            this.flagKindTreatment=true;
        this.toggleLayer=false;
      },
      (error)=>{
      
       // this.clinicVisitToSave.ClinicVisitsId=5;
       this.toggleLayer=false;
       alert("try later");
      }
 
    )
  }
  setclinicVisits(clinicVisits){
    let persons=this.allPersons.filter(p=>p.personsId==clinicVisits.personsId)[0];
    this.clinicVisitsform.controls["manId"].setValue(persons.manId);
    if(clinicVisits.preformed && clinicVisits.preformed!=0){
    let preformed=this.allPreformed.filter(P=>P.employeeId==clinicVisits.preformed)[0];
    this.clinicVisitsform.controls["Preformed"].setValue(preformed);
    }
    if(clinicVisits.doctor && clinicVisits.doctor!=0){
    let doctor=this.allDoctor.filter(d=>d.employeeId==clinicVisits.doctor)[0]
    this.clinicVisitsform.controls["Doctor"].setValue(doctor);
  }
  if(clinicVisits.morphology && clinicVisits.morphology!=0){
    let morphology=this.allEmployees.filter(P=>P.employeeId==clinicVisits.morphology)[0];
    this.clinicVisitsform.controls["Morphology"].setValue(morphology);
  }
    let Treatments=this.allTreatments.filter(t=>t.treatmentId==clinicVisits.treatmentsId)[0];
    this.clinicVisitsform.controls["TreatmentsId"].setValue(Treatments);
    this.clinicVisitsform.controls["PaymentMethod"].setValue(clinicVisits.paymentMethod);
    this.clinicVisitsform.controls["Receipt"].setValue(clinicVisits.receipt);
    this.clinicVisitsform.controls["C"].setValue(clinicVisits.c);
    this.clinicVisitsform.controls["Co"].setValue(clinicVisits.co);
    this.clinicVisitsform.controls["done"].setValue(clinicVisits.done);
    this.clinicVisitsform.controls["doneDoctor"].setValue(clinicVisits.doneDoctor);
    if(clinicVisits.doneMorphology){
    this.clinicVisitsform.controls["doneMorphology"].setValue(clinicVisits.doneMorphology);
  }
   if(clinicVisits.didNotArrive){
  this.clinicVisitsform.controls["didNotArrive"].setValue(clinicVisits.didNotArrive)
  }
  if(clinicVisits.apartmentHr){
  this.clinicVisitsform.controls["apartmentHr"].setValue(clinicVisits.apartmentHr);
 }
 if(clinicVisits.apartmentVy){
  this.clinicVisitsform.controls["apartmentVy"].setValue(clinicVisits.apartmentVy);
}
if(clinicVisits.apartmentYy){
  this.clinicVisitsform.controls["apartmentYy"].setValue(clinicVisits.apartmentYy);
}
    this.clinicVisitsform.controls["Amount"].setValue(clinicVisits.amount);
    this.clinicVisitsform.controls["Subsidization"].setValue(clinicVisits.subsidization);
    let newDate = new Date(clinicVisits.visitsDate);
    this.clinicVisitsform.controls["VisitsDate"].setValue(newDate);
    // let newtime=new Date(clinicVisits.visitTime);
    this.clinicVisitsform.controls["visitTime"].setValue(clinicVisits.visitTime); 
  }
  toClinicVisits(){
    this._ClinicVisitsService.getById(this.clinicVisitsId).subscribe(
      (data)=>{
        this.clinicVisitsToEdit=data;
        this.theClinicVisit=data;
        this.clinicVisitsId= this.theClinicVisit.clinicVisitsId;
        this.setclinicVisits( this.theClinicVisit);
        this.flagForm=true;
        console.log("toclinic");
        this.clinicVisitToSave.signature=this.theClinicVisit.signature;
       console.log(this.theClinicVisit.signature);
       
        if(this.theClinicVisit.treatmentsId==1||this.theClinicVisit.treatmentsId==2||this.theClinicVisit.treatmentsId==4||this.theClinicVisit.treatmentsId==7)
this.flagKindTreatment=true;
        this.flagKindTreatment=true;
        this.flagPayment=false;
        this.flagSign=false;
        this.flagClinicVisits=true;
        this.flagSa=false;
        this.flagIui=false;
        this.flagPct=false;
        this.flagInsemination=false;
        this.flagIUISA=false;
        this.flagDidNotArrive=false;
      },
      (error)=>{
        alert("try later")

      }
    )

  }
  toPayment(){
    
    this.flagPayment=true;
    this.flagClinicVisits=false;
    this.flagDidNotArrive=false;
    this.flagSa=false;
    this.flagIui=false;
    this.flagPct=false;
    this.flagInsemination=false;
    this.flagIUISA=false;
    this.flagSign=false;

    this.paymentform.controls["PaymentMethod"].setValue(this.theClinicVisit.paymentMethod);
    this.paymentform.controls["Receipt"].setValue(this.theClinicVisit.receipt);
    this.paymentform.controls["Amount"].setValue(this.theClinicVisit.amount);
    this.paymentform.controls["Subsidization"].setValue(this.theClinicVisit.subsidization);
    this.paymentform.controls["SubsidizationAmount"].setValue(this.theClinicVisit.subsidizationAmount);
    this.paymentform.controls["SubsidizationApprove"].setValue(this.theClinicVisit.subsidizationApprove);
    this.paymentform.controls["CheckNumber"].setValue(this.theClinicVisit.checkNumber);
    
  }
  toEdit(){
   if(this.theClinicVisit.didNotArrive==true &&  this.theClinicVisit.closed==true){
    this.flagClinicVisits=false;
    this.flagPayment=false;
    this.flagSign=false;

    this.flagDidNotArrive=true;
return;
   }
    let nameTreatments=this.allTreatments.filter(t=>t.treatmentId== this.theClinicVisit.treatmentsId);
    switch(nameTreatments[0].treatmentName) { 
      case "SA": { 
        this.flagSa=true;
        this.flagClinicVisits=false;
        this.flagPayment=false;
        this.flagSign=false;

         break; 
      } 
      case "לא ניתן לבצע בדיקת זרע": { 
        this.flagSa=true;
        this.flagClinicVisits=false;
        this.flagPayment=false;
        this.flagSign=false;

         break; 
      } 
      case "IUI": { 
        this.flagIui=true;
        this.flagClinicVisits=false;
        this.flagPayment=false;
        this.flagSign=false;

         break; 
      } 
      case "לא ניתן לבצע השבחה": { 
        this.flagIui=true;
        this.flagClinicVisits=false;
        this.flagPayment=false;
        this.flagSign=false;

         break; 
      } 
      case "Wash": { 
        this.flagIui=true;
        this.flagClinicVisits=false;
        this.flagPayment=false;
        this.flagSign=false;

         break; 
      } 
      case "PCT": { 
        this.flagPct=true;
        this.flagClinicVisits=false;
        this.flagPayment=false;
        this.flagSign=false;

        break; 
     } 
     case "Insemination": { 
      this.flagInsemination=true;
      this.flagClinicVisits=false;
      this.flagPayment=false;
      this.flagSign=false;
      // this.flagClinicVisits=false;
      break; 
   } 
   case "IUI + SA": { 
    this.flagIUISA=true;
    this.flagClinicVisits=false;
    this.flagPayment=false;
    this.flagSign=false;
    break; 
 } 
 case "בדיקת זרע ולא ניתן לבצע השבחה": { 
  this.flagIUISA=true;
    this.flagClinicVisits=false;
    this.flagPayment=false;
    this.flagSign=false;
    break; 
} 
   } 
   
   
  }
  toSign(){
    this.flagSign=true;
    this.flagPayment=false;
    this.flagClinicVisits=false;
    this.flagDidNotArrive=false;
    this.flagSa=false;
    this.flagIui=false;
    this.flagPct=false;
    this.flagInsemination=false;
    this.flagIUISA=false;
  }
  toForm(){

  }

  costCalculationPayment(){

    let treatments=this.clinicVisitsform.controls["TreatmentsId"].value;
    let treatmentCost=treatments.treatmentCost;
    let amount = 0;
    if(this.clinicVisitsform.controls["C"].value==true){
      
      let cTreatments=this.allTreatments.filter(t=>t.treatmentName=="C")[0].treatmentCost;
      amount+=cTreatments

    }
    // if(this.clinicVisitsform.controls["Co"].value==true){
    //   // צריך לשנות לערך גנרי
    //   amount+=50;
    // }

    this.paymentform.controls["Amount"].setValue(treatmentCost+amount);
  }
  costCalculation(){
    let treatments=this.clinicVisitsform.controls["TreatmentsId"].value;
    let treatmentCost=treatments.treatmentCost;
    let amount = 0;
    if(this.clinicVisitsform.controls["C"].value==true){
      // צריך לשנות לערך גנרי
      
      let cTreatments=this.allTreatments.filter(t=>t.treatmentName=="C")[0].treatmentCost;
      amount+=cTreatments

    }
    // if(this.clinicVisitsform.controls["Co"].value==true){
    //   // צריך לשנות לערך גנרי
    //   amount+=50;
    // }

    this.clinicVisitsform.controls["Amount"].setValue(treatmentCost+amount);

  }
  displayPerson(){
    let persons=this.allPersons.filter(p=>p.manId==this.clinicVisitsform.controls["manId"].value)[0];
    let stringll=""
    if(persons)
    stringll=`${persons.manId } ${persons.womanId} \n ${persons.familyName} \n ${persons.manName} ו ${persons.womanName}`;
    this.clinicVisitsform.controls["person"].setValue(stringll);
  }
  editPerson(){
    let persons=this.allPersons.filter(p=>p.manId==this.clinicVisitsform.controls["manId"].value)[0];
    if(persons)
    {
      this.personsIdToEdit=persons.personsId;
      this.displayResponsive=true;
    }
    // this._router.navigate(["main/persons/"+persons.personsId]);
    // this._router.navigate([]).then(result => {  window.open("main/persons/"+persons.personsId, '_blank'); });
    
  }
  closeDialogPerson(){
    this.displayResponsive=false;
  }
  newPerson(){
    this._router.navigate(["main/persons"]);
  }
  private _filterEmplyees(value: string): string[] {
    // const filterValue = this._normalizeValue(value);
    let theEmplyees= this.allEmployees.filter(emplyees => emplyees.employeeName.toString().includes(value));
    let employeeName=[];
    for(let i=0;i<theEmplyees.length;i++){
      employeeName.push(theEmplyees[i].employeeName.toString());
    }
    return employeeName;

  }
  private _filterPersons(value: string): string[] {
    // const filterValue = this._normalizeValue(value);
    let thePersons= this.allPersons.filter(persons => persons.manId.toString().includes(value));
    let mansId=[];
    for(let i=0;i<thePersons.length;i++){
      mansId.push(thePersons[i].manId.toString());
    }
    return mansId;

  }
  constructor(private _TreatmentService:TreatmentsService,private _ClinicVisitsService:ClinicVisitsService,private _PersonsService:PersonsService,
    private _router:Router,private _EmployeesService:EmployeesService
    ,private _acr:ActivatedRoute,private _PermissionService:PermissionService,private _IuiService:IuiService, private _InseminationService:InseminationService) { }
  ngOnInit() {
    this.director=this._PermissionService.director;
    this._acr.params.subscribe(
      (params: Params) => {
        this.clinicVisitsIdEdit=params.clinicVisitsId;
      }
    )
 
    this._PersonsService.getAll().subscribe(
      (data)=>{
        this.allPersons=data;
        this.filteredPersons = this.clinicVisitsform.controls["manId"].valueChanges.pipe(
          startWith(''),
          map(value => this._filterPersons(value.toString())));
          this._EmployeesService.getAll().subscribe(
            (data)=>{   
              let all=data;
              this.allEmployees=data.filter(emp => [12, 13, 14, 19].includes(emp.employeeId));
              this.allDoctor=all.filter(em=>em.role==1);
              this.allPreformed=all.filter(emp=>emp.role==2);
              this._TreatmentService.getAll().subscribe(
                (data)=>{
                  this.allTreatments=data;
                  if(this.clinicVisitsIdInput){
                    this.clinicVisitsIdEdit=this.clinicVisitsIdInput;
                    this.flagInDialog=true;
                  }
                  if( this.clinicVisitsIdEdit){
                    this._ClinicVisitsService.getById(this.clinicVisitsIdEdit).subscribe(
                      (data)=>{
                        this.clinicVisitsToEdit=data;
                        this.theClinicVisit=data;
                        this.clinicVisitsId= this.theClinicVisit.clinicVisitsId;
                        this.setclinicVisits( this.theClinicVisit);
                        this.flagForm=true;
                        if(this.theClinicVisit.treatmentsId==1||this.theClinicVisit.treatmentsId==2||this.theClinicVisit.treatmentsId==4||this.theClinicVisit.treatmentsId==7)
                        this.flagKindTreatment=true;
                        this.clinicVisitToSave.signature=this.theClinicVisit.signature;

                      },
                      (error)=>{
                        alert("try later")
              
                      }
                    )
                  }
                },
                (error)=>{
                  // this.allTreatments=this.tmpTreatments;
                  alert("error")
                }
              )
              
              // this.filteredEmplyees = this.clinicVisitsform.controls["Preformed"].valueChanges.pipe(
              //   startWith(''),
              //   map(value => this._filterEmplyees(value.toString())));
              },
           (error)=>{ 
            // this.allEmployees=this.tmpEmplyees;
            //   this.filteredEmplyees = this.clinicVisitsform.controls["Preformed"].valueChanges.pipe(
            //     startWith(''),
            //     map(value => this._filterEmplyees(value.toString())));
            alert("error")
           }   
          );
        },
     (error)=>{ 
      //  this.allPersons=this.tmp;
      //  this.filteredPersons = this.clinicVisitsform.controls["manId"].valueChanges.pipe(
      //   startWith(''),
      //   map(value => this._filterPersons(value.toString())));
      alert("error")
     }   
    );
  

   

  }

}



// control = new FormControl();
// streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];
// filteredStreets: Observable<string[]>;

// ngOnInit() {
//   this.filteredStreets = this.control.valueChanges.pipe(
//     startWith(''),
//     map(value => this._filter(value))
//   );
// }

// private _filter(value: string): string[] {
//   const filterValue = this._normalizeValue(value);
//   return this.streets.filter(street => this._normalizeValue(street).includes(filterValue));
// }

// private _normalizeValue(value: string): string {
//   return value.toLowerCase().replace(/\s/g, '');
// }