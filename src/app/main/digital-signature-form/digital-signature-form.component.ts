import { Router } from '@angular/router';
import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { SaService } from '../services/sa.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SaDTO } from '../models/SaDTO';
import { ClinicVisitsService } from '../services/clinic-visits.service';
import { PersonsService } from '../services/persons.service';
import { TreatmentService } from '../services/treatment.service';
import { ClinicVisitsDTO } from '../models/ClinicVisitsDTO';
import { PersonsDTO } from '../models/PersonsDTO';
import { TreatmentsDTO } from '../models/TreatmentsDTO';
import { Form } from '../models/Form';
import { EmployeesDTO } from '../models/EmployeesDTO';

//import { SignaturePad } from 'ngx-signaturepad'; // 🚀 חדש - שימוש ב-signature pad
// import {  ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import SignaturePad from 'signature_pad';
import SignaturePad from 'signature_pad';
import { error, log } from 'console';
@Component({
  selector: 'app-digital-signature-form',
  templateUrl: './digital-signature-form.component.html',
  styleUrls: ['./digital-signature-form.component.css']
})
export class DigitalSignatureFormComponent implements OnInit ,AfterViewInit  
{
  // @ViewChild('signatureCanvas', { static: false }) signatureCanvas: ElementRef;
  // signaturePad: SignaturePad;  // הצהרת signaturePad כאן
  @ViewChild('signatureCanvas', { static: false }) signatureCanvas: ElementRef;
  signaturePad: SignaturePad;


  @Input() ClinicVisitsId: number;
  @Input() flag: Boolean=false;
 clinicVisits: ClinicVisitsDTO;

  signature:string="";
  //clinicVisits:ClinicVisitsDTO;
  treatment:TreatmentsDTO;
  person:PersonsDTO;
  sa:boolean=false;
  iui:boolean=false;
  saIui:boolean=false;
  insemination:boolean=false;
  // signform=new FormGroup({
  //   ManName :  new FormControl(""),
  //   WomanName : new FormControl(""),
  //   FamilyName : new FormControl(""),
  //   ManId : new FormControl(""),
  //   WomanId : new FormControl(""),
  //   TreatmentName: new FormControl("")
  // })
  // setPerson(person:PersonsDTO){
  //   this.signform.controls["ManName"].setValue(person.manName);
  //   this.signform.controls["WomanName"].setValue(person.womanName);
  //   this.signform.controls["FamilyName"].setValue(person.familyName);
  //   this.signform.controls["ManId"].setValue(person.manId);
  //   this.signform.controls["WomanId"].setValue(person.womanId);
  // }
  constructor(private _clinicVisitsService:ClinicVisitsService,private _personsService:PersonsService,private _treatmentService:TreatmentService) { }

  ngOnInit() {
    this._clinicVisitsService.getById(this.ClinicVisitsId).subscribe(
     
        (data) => {
          this.clinicVisits = data;
      
          // אם ה-signaturePad כבר מוכן
          setTimeout(() => {
            this.loadExistingSignature();
          }, 0);
        //במקרה שכבר נסגר דואג שהכי מעודכן יהיה במשתנה   זה כי בו משתמשים לסגירה
        this._treatmentService.getById(this.clinicVisits.treatmentsId).subscribe(
          (data)=>{
            this.treatment=data;
               if(this.treatment.treatmentName=="SA")
                 this.sa=true;
          else if(this.treatment.treatmentName=="IUI")
                this.iui=true;
          else  if(this.treatment.treatmentName=="IUI + SA")
                this.saIui=true;
          else  if(this.treatment.treatmentName=="Insemination")
            this.insemination=true;
          },
          (error)=>{alert("try later")})
        this._personsService.getById(this.clinicVisits.personsId).subscribe(
          (data)=>{
            this.person=data;
           },
          (error)=>{alert("try later")}
          
        )
       
        
      },
     (error)=>{ alert("try later")})

   }
  ngAfterViewInit(){
 this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement, {
      minWidth: 1,    // הגדרת רוחב הקו המינימלי
      maxWidth: 3,    // הגדרת רוחב הקו המקסימלי
      penColor: 'black',  // צבע העט
      backgroundColor: 'white'  // צבע הרקע
    });
  }
  loadExistingSignature() {
    if (this.clinicVisits.signature) {
      this.signaturePad.fromDataURL(this.clinicVisits.signature);
    }
  }
  saveSignature() {
    if (this.signaturePad.isEmpty()) {
      console.log('החתימה ריקה');
    } else {
      this.signature = this.signaturePad.toDataURL();  // המרת החתימה לפורמט Base64
     // console.log('חתימה בטופס לאחר השמירה: ', this.saform.controls['Signature'].value); // בדוק אם החתימה נשמרה בטופס
  
      console.log(this.signature);  // תוכל לשלוח את זה לשרת
  
  
      // שמירת החתימה בטופס
      // return  this._clinicVisitsService.saveSa(this.saToSave);
      this.clinicVisits.signature=this.signature;
      this._clinicVisitsService.saveClinicVisit(this.clinicVisits)  
      .subscribe(
        (data)=>{
        console.log("succsessfull");
        
        },
        (err)=>{
          alert("try later");
        }
      )
    }
  }
  clearSignature() {
    this.signaturePad.clear();
  }
}
