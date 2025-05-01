import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { SaService } from '../services/sa.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SaDTO } from '../models/SaDTO';
import { ClinicVisitsService } from '../services/clinic-visits.service';
import { PersonsService } from '../services/persons.service';
import { ClinicVisitsDTO } from '../models/ClinicVisitsDTO';
import { PersonsDTO } from '../models/PersonsDTO';
import { Form } from '../models/Form';
import { EmployeesDTO } from '../models/EmployeesDTO';
import { EmployeesService } from '../services/employees.service';
import { EmailService } from '../services/email.service';
import  jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import {strGnuMICR} from '../../fonts/GnuMICRttfBase64Encoded'
import {strAriel} from '../../fonts/ariel'
import { Observable } from 'rxjs';
import {strLogo} from '../stringLogo'
//import { SignaturePad } from 'ngx-signaturepad'; // 🚀 חדש - שימוש ב-signature pad
// import {  ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import SignaturePad from 'signature_pad';
import SignaturePad from 'signature_pad';
// import { log } from 'console';

// import {strLogo} from '../app/stringFile';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-sa',
  templateUrl: './sa.component.html',
  styleUrls: ['./sa.component.css']
})
export class SaComponent implements OnInit ,AfterViewInit  
{
  // @ViewChild('signatureCanvas', { static: false }) signatureCanvas: ElementRef;
  // signaturePad: SignaturePad;  // הצהרת signaturePad כאן
  @ViewChild('signatureCanvas', { static: false }) signatureCanvas: ElementRef;
  signaturePad: SignaturePad;


  @Input() ClinicVisitsId: number;
  @Input() flag: Boolean=false;
  signature:string="";
  myFile: File;
  toggleLayer:boolean=false;
  saToSave:SaDTO;
  sa:SaDTO;
  saId:number=0;
  closed:Boolean=false;
  clinicVisits:ClinicVisitsDTO;
  persons:PersonsDTO;
  givingTime:Date;
  doctor:EmployeesDTO;
  preformed:EmployeesDTO;
  morphology:EmployeesDTO;
  interval;
  saform=new FormGroup({
    ManName :  new FormControl(""),
    WomanName : new FormControl(""),
    FamilyName : new FormControl(""),
    ManId : new FormControl(""),
    WomanId : new FormControl(""),
    ManPhone : new FormControl(""),
    WomanPhone : new FormControl(""),
    DoctorTreatment :  new FormControl("",[Validators.required]),
    Fresh : new FormControl(false),
    Condom : new FormControl(false),
    Ejac : new FormControl(false),
    Cup : new FormControl(false),
    Other : new FormControl(""),
    GivingTime : new FormControl(""),
    GivingTimeString : new FormControl(null),
    GivingSample : new FormControl(null),
    DaysAvoided : new FormControl(""),
    VolumeCc : new FormControl(""),
    Appearance : new FormControl(""),
    Conc105cc : new FormControl(""),
    Motility : new FormControl(""),
    Motility_rank_1 : new FormControl(""),
    Motility_rank_2 : new FormControl(""),
    Motility_rank_3 : new FormControl(""),
    Motility_rank_4 : new FormControl(""),
    Grade : new FormControl(""),
    Ph : new FormControl(""),
    Comments: new FormControl(""),
    NormalForms : new FormControl(""),
    LargeHeads  : new FormControl(""),
    SmallHeads : new FormControl(""),
    RoundHeads : new FormControl(""),
    TaperedHeads : new FormControl(""),
    PyramidalHeads : new FormControl(""),
    AmorphousHeads : new FormControl(""),
    PinHeads : new FormControl(""),
    NeckDefects : new FormControl(""),
    CytoplasmicDroplets : new FormControl(""),
    TailDefects : new FormControl(""),
    Signature : new FormControl("")

  })
  sendSuccessfully:boolean=false;
  sendFailed:boolean=false;
  sending:boolean=true;
  displayResponsive:boolean=false;
  stringPdfToSave:string;
  waitingForSending:boolean=false
  from:Form=new Form()
  emailFrom=new FormGroup({
    email :  new FormControl("",[Validators.email]),
    manEmail :  new FormControl("",[Validators.email]),
    womanEmail :  new FormControl("",[Validators.email])
  })
  setPersons(persons:PersonsDTO){
    this.saform.controls["ManName"].setValue(persons.manName);
    this.saform.controls["WomanName"].setValue(persons.womanName);
    this.saform.controls["FamilyName"].setValue(persons.familyName);
    this.saform.controls["ManId"].setValue(persons.manId);
    this.saform.controls["WomanId"].setValue(persons.womanId);
    this.saform.controls["ManPhone"].setValue(persons.manPhone);
    this.saform.controls["WomanPhone"].setValue(persons.womanPhone);
  }
  // setoctor(doctor:EmployeesDTO){
  //   this.saform.controls["DoctorTreatment"].setValue(doctor.employeeName);
  // }
  setSa(sa:SaDTO){
    // this.saform.controls["GivingTime"].setValue(sa.givingTime);
    this.saform.controls["Fresh"].setValue(sa.fresh);
    this.saform.controls["Condom"].setValue(sa.condom);
    this.saform.controls["DoctorTreatment"].setValue(sa.doctorTreatment);
    this.saform.controls["Ejac"].setValue(sa.ejac);
    this.saform.controls["Cup"].setValue(sa.cup);
    this.saform.controls["Other"].setValue(sa.other);
    // let t=sa.givingTime.toString().split("T")[1]
    // let str=sa.givingTimeString.split(' ')[4].substring(0,5)
    // this.saform.controls["GivingTimeString"].setValue(new Date('2017-03-08T00:00:00+05:44'));
    // this.givingTime=sa.givingTime;
    this.saform.controls["GivingTimeString"].setValue(sa.givingTimeString)
    this.saform.controls["GivingSample"].setValue(sa.givingSample)
    this.saform.controls["DaysAvoided"].setValue(sa.daysAvoided)
    this.saform.controls["VolumeCc"].setValue(sa.volumeCc);
    this.saform.controls["Appearance"].setValue(sa.appearance);
    this.saform.controls["Conc105cc"].setValue(sa.conc105cc);
    this.saform.controls["Motility"].setValue(sa.motility);
    this.saform.controls["Motility_rank_1"].setValue(sa.motility_rank_1);
    this.saform.controls["Motility_rank_2"].setValue(sa.motility_rank_2);
    this.saform.controls["Motility_rank_3"].setValue(sa.motility_rank_3);
    this.saform.controls["Motility_rank_4"].setValue(sa.motility_rank_4);
   
    this.saform.controls["Grade"].setValue(sa.grade);
    this.saform.controls["Ph"].setValue(sa.ph);
    this.saform.controls["Comments"].setValue(sa.comments);
    this.saform.controls["NormalForms"].setValue(sa.normalForms);
    this.saform.controls["LargeHeads"].setValue(sa.largeHeads);
    this.saform.controls["SmallHeads"].setValue(sa.smallHeads);
    this.saform.controls["RoundHeads"].setValue(sa.roundHeads);
    this.saform.controls["TaperedHeads"].setValue(sa.taperedHeads);
    this.saform.controls["PyramidalHeads"].setValue(sa.pyramidalHeads);
    this.saform.controls["AmorphousHeads"].setValue(sa.amorphousHeads);
    this.saform.controls["PinHeads"].setValue(sa.pinHeads);
    this.saform.controls["NeckDefects"].setValue(sa.neckDefects);
    this.saform.controls["CytoplasmicDroplets"].setValue(sa.cytoplasmicDroplets);
    this.saform.controls["TailDefects"].setValue(sa.tailDefects);
    this.saform.controls['Signature'].setValue(this.signature);

  }
    saveSaObservable():Observable<SaDTO>{
  
      
    this.saToSave= new SaDTO();
    // this.saToSave.signature = this.saform.controls["Signature"].value.toString();  // תיקון כאן
    // console.log(this.saToSave.signature);  // בדוק אם החתימה נשמרה

    this.saToSave.said=this.saId;
    this.saToSave.clinicVisitsId=this.ClinicVisitsId;
    // let t=  this.saform.controls["GivingTime"].value;
    // let time=t.toLocaleTimeString('it-IT');
    // let arr=time.split(':');
    // let hour=+arr[0]
    // let min=+arr[1]
    // let sec=+arr[2]
    // let date=this.clinicVisits.visitsDate;
    // date.setHours(hour, min,sec)
    // this.saToSave.givingTime=date;
    // this.saToSave.givingTime.setHours(hour, min,sec);
    // this.saToSave.givingTime=window.moment(time.toLocaleTimeString('it-IT'), 'HH:mm');
    if(this.saform.controls["GivingTimeString"].value){
    this.saToSave.givingTimeString= this.saform.controls["GivingTimeString"].value.toString();
  }
  else{
    this.saToSave.givingTimeString=" "
  }
  if(this.saform.controls["GivingSample"].value){
    this.saToSave.givingSample= this.saform.controls["GivingSample"].value.toString();
  }
  else{
    this.saToSave.givingSample=" "
  }
  // if(this.saform.controls["DoctorTreatment"].value){
  //   this.saToSave.doctorTreatment= this.saform.controls["DoctorTreatment"].value.toString();
  // }
  // else{
  //   this.saToSave.doctorTreatment=" ";
  // }
    this.saToSave.doctorTreatment= this.saform.controls["DoctorTreatment"].value.toString();
    this.saToSave.fresh= this.saform.controls["Fresh"].value;
    this.saToSave.condom= this.saform.controls["Condom"].value;
    this.saToSave.ejac= this.saform.controls["Ejac"].value;
    this.saToSave.cup= this.saform.controls["Cup"].value;
    this.saToSave.other= this.saform.controls["Other"].value.toString();
    this.saToSave.givingTime= new Date();
    this.saToSave.volumeCc= this.saform.controls["VolumeCc"].value.toString();
    this.saToSave.appearance= this.saform.controls["Appearance"].value.toString();
    this.saToSave.conc105cc= this.saform.controls["Conc105cc"].value.toString();
    this.saToSave.motility= this.saform.controls["Motility"].value.toString();
    this.saToSave.motility_rank_1= this.saform.controls["Motility_rank_1"].value.toString();
    this.saToSave.motility_rank_2= this.saform.controls["Motility_rank_2"].value.toString();
    this.saToSave.motility_rank_3= this.saform.controls["Motility_rank_3"].value.toString();
    this.saToSave.motility_rank_4= this.saform.controls["Motility_rank_4"].value.toString();   
    this.saToSave.grade= this.saform.controls["Grade"].value.toString();
    this.saToSave.ph= this.saform.controls["Ph"].value.toString();
    this.saToSave.comments=this.saform.controls["Comments"].value.toString();
    this.saToSave.normalForms= this.saform.controls["NormalForms"].value.toString();
    this.saToSave.largeHeads= this.saform.controls["LargeHeads"].value.toString();
    this.saToSave.smallHeads=  this.saform.controls["SmallHeads"].value.toString();
    this.saToSave.roundHeads= this.saform.controls["RoundHeads"].value.toString();
    this.saToSave.taperedHeads= this.saform.controls["TaperedHeads"].value.toString();
    this.saToSave.pyramidalHeads= this.saform.controls["PyramidalHeads"].value.toString();
    this.saToSave.amorphousHeads= this.saform.controls["AmorphousHeads"].value.toString();
    this.saToSave.pinHeads= this.saform.controls["PinHeads"].value.toString();
    this.saToSave.neckDefects= this.saform.controls["NeckDefects"].value.toString();
    this.saToSave.cytoplasmicDroplets= this.saform.controls["CytoplasmicDroplets"].value.toString();
    this.saToSave.tailDefects= this.saform.controls["TailDefects"].value.toString();
    this.saToSave.daysAvoided= this.saform.controls["DaysAvoided"].value.toString();
    this.saToSave.signature= this.saform.controls["Signature"].value.toString();

  return  this._SaService.saveSa(this.saToSave);
  }
  saveSa(){
    this.toggleLayer=true;
    this.saveSaObservable()
    .subscribe(
        (data)=>{
          this.sa=data;
          this.saId=this.sa.said;
          this.toggleLayer=false;
          },
       (error)=>{ 
        this.toggleLayer=false;
         alert("try later");}
  
      )
  }

  sendEmail(){
    let listEmails=[];
    let email=this.emailFrom.controls["email"].value.toString();
    if(email){
      listEmails.push(email);
    }
    // if(email){
    //   if(!this.validateEmail(email)){
    //     this.emailNotValid=true;
    //     return;
    //   }

    // }
    let manEmail=this.emailFrom.controls["manEmail"].value.toString();
    if(manEmail){
      listEmails.push(manEmail);
    }
    let womanEmail=this.emailFrom.controls["womanEmail"].value.toString();
    if(womanEmail){
      listEmails.push(womanEmail);
    }
    this.sending=false;
    // this.messege=false;
    this.from.emails=listEmails;
    this.from.file=this.stringPdfToSave;
    this.from.familyName=this.persons.familyName;
    this.from.treatments=false;
    this.waitingForSending=true;

    this._EmailService.sendEmail(this.from).subscribe(
      (data)=>{
        if(data){
          this.waitingForSending=false
          this.sendSuccessfully=true;
        }
        else{
          this.waitingForSending=false
          this.sendFailed=true;
        }
      
      },
      (err)=>
      {
      this.sendFailed=true;
      }
    )
  }
  
  
  constructor(private _SaService:SaService,private _clinicVisitsService:ClinicVisitsService
    ,private _personsService:PersonsService,private _EmployeesDTO:EmployeesService,private _EmailService:EmailService) { }
  ngOnInit() {
    debugger
    this._SaService.getByClinicVisitId(this.ClinicVisitsId).subscribe(
      (data)=>{
        if(data){
        this.sa=data;
        this.saId=this.sa.said;
        this.setSa(this.sa);
        if (this.sa.signature) {
          this.signature = this.sa.signature;  // אם יש חתימה, נסה להציג אותה
          this.drawSignatureOnCanvas();
        }
      }},

      (err)=>{}
    )
    this._clinicVisitsService.getById(this.ClinicVisitsId).subscribe(
      (data)=>{
        this.clinicVisits=data;
        this.closed=this.clinicVisits.closedSA;
        //במקרה שכבר נסגר דואג שהכי מעודכן יהיה במשתנה   זה כי בו משתמשים לסגירה
        if(this.closed){
          
          this.saToSave=this.sa;
          clearInterval(this.interval);
        }
        this._personsService.getById(this.clinicVisits.personsId).subscribe(
          (data)=>{this.persons=data;
            this.setPersons(this.persons)},
          (error)=>{alert("try later")}
          
        )
        this._EmployeesDTO.getById(this.clinicVisits.preformed).subscribe(
          (data)=>{
            this.preformed=data;
            // this.setoctor(this.doctor);
          },
          (error)=>{alert("try later")}
        )
        this._EmployeesDTO.getById(this.clinicVisits.morphology).subscribe(
          (data)=>{
            this.morphology=data;
            // this.setoctor(this.doctor);
          },
          (error)=>{alert("try later")}
        )
      },
     (error)=>{ alert("try later")})
     this.interval = setInterval(() => {
      this.saveSa()
          },180000)
  }
  ngAfterViewInit() {
    // אתחול של SignaturePad
    this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement, {
      minWidth: 1,    // הגדרת רוחב הקו המינימלי
      maxWidth: 3,    // הגדרת רוחב הקו המקסימלי
      penColor: 'black',  // צבע העט
      backgroundColor: 'white'  // צבע הרקע
    });
  }
  // ngAfterViewInit() {
  //   // אתחול של SignaturePad אחרי שהקנבס נטען
  //   this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement);
  // }
  ngOnDestroy() {
    clearInterval(this.interval);

}

 clearSignature() {
  this.signaturePad.clear();
}
showSignature(){
}
drawSignatureOnCanvas() {
  if (this.signature) {
    const canvas = this.signatureCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = this.signature; // משתמשים ב-base64
    img.onload = () => {
      ctx!.drawImage(img, 0, 0, canvas.width, canvas.height); // מציירים את החתימה על ה-canvas
    };
  }
}
saveSignature() {
  if (this.signaturePad.isEmpty()) {
    console.log('החתימה ריקה');
  } else {
    this.signature = this.signaturePad.toDataURL();  // המרת החתימה לפורמט Base64
    this.saform.controls['Signature'].setValue(this.signature);
    console.log('חתימה בטופס לאחר השמירה: ', this.saform.controls['Signature'].value); // בדוק אם החתימה נשמרה בטופס

    console.log(this.signature);  // תוכל לשלוח את זה לשרת

    // שמירת החתימה בטופס
    this.saform.controls['Signature'].setValue(this.signature);
  }
}
  closeSA(action = 'open') { 
   
    this.saveSaObservable()
    .subscribe(
        (data)=>{
          this.saToSave=data;
          this.sa=data;
          this.clinicVisits.closedSA=true;
          
          
          this._clinicVisitsService.saveClinicVisit(this.clinicVisits)
          .subscribe(
            (data)=>{
              this.generatePDF(action);
              this.closed=true;
            },
            (err)=>{
              alert("try later");
            }
          )
          },
       (error)=>{ alert("try later");}
  
      )
   
        }
        revers(data){
          return data.split(' ').reverse().join(' ');

        }
        reversVolumeCc(data){
          return data.split(' ').reverse().join('  ');
        }
        generatePDF(action = 'open'){
          let date;
          let reversData;
          if(this.clinicVisits.visitsDate){
            let arr=this.clinicVisits.visitsDate.toString().split('T')[0].split('-');
            date=`${arr[2]}/${arr[1]}/${arr[0]}`;
            reversData=`${arr[0]}/${arr[1]}/${arr[2]}`
          }
          else date=""
          pdfFonts.pdfMake.vfs['GnuMICR_b64']=strGnuMICR;
          pdfFonts.pdfMake.vfs['ARIEL_b64']=strAriel;
          pdfMake.fonts = {
            Roboto: {
                normal:      'Roboto-Regular.ttf',
                bold:        'Roboto-Medium.ttf',
                italics:     'Roboto-Italic.ttf',
                bolditalics: 'Roboto-MediumItalic.ttf'
            },
            GnuMICR:{
                normal:      'GnuMICR_b64',
                bold:        'GnuMICR_b64',
                italics:     'GnuMICR_b64',
                bolditalics: 'GnuMICR_b64'
            },
            ARIELF:{
              normal:      'ARIEL_b64',
              bold:        'ARIEL_b64',
              italics:     'ARIEL_b64',
              bolditalics: 'ARIEL_b64'
          }
        }
          let docDefinition = {  
            content: [ 
              {
                columns:[
                  [
                    {  
                      text: "Zir Chemed", 
                      font: 'ARIELF', 
                      color: '#03746e',
                      bold: true, 
                      fontSize: 10  
                         
                    }, 
                    {  
                      text: "Dr. Baruch Brooks, PhD" , 
                      font: 'ARIELF' ,
                      color: '#03746e',
                      fontSize: 10   
                    },
                    {  
                      text: "Scientific Director and Fertility Expert", 
                      font: 'ARIELF' ,
                      color: '#03746e',
                      fontSize: 10    
                    },
                    {  
                      text: "Tel: 02-6535395", 
                      font: 'ARIELF',
                      color: '#03746e',
                      fontSize: 10     
                    },
                    {  
                      text: "Email: drbrooks@zirchemed.org ", 
                      font: 'ARIELF' ,
                      color: '#03746e',
                      fontSize: 10  
                    }
                  ],
                  [
                    {
                      // image: 'data:image/jpeg;base64,...encodedContent...',
                      
                      image: `data:image/JPG;base64,${strLogo}` 
                      ,width: 130,
                      height: 100,
                      alignment: 'center', 
                    }
                  ],
              
                  [
                    {  
                      text: this.revers(" ציר חמד "), 
                      font: 'ARIELF',
                      alignment: 'right' ,
                      color: '#03746e',
                      bold: true, 
                      fontSize: 10  
                    }, 
                    {  
                      text: this.revers("  דר ברוך ברוקס PhD") , 
                      font: 'ARIELF' ,
                      alignment: 'right' ,
                      color: '#03746e',
                      fontSize: 10   
                    },
                    {  
                      text: this.revers(" מנהל מדעי ומומחה לפוריות "), 
                      font: 'ARIELF',
                      alignment: 'right' ,
                      color: '#03746e',
                      fontSize: 10    
                    },
                    {  
                      text:  this.revers("טל: 02-6535395"), 
                      font: 'ARIELF' ,
                      alignment: 'right',
                      color: '#03746e',
                      fontSize: 10    
                    },
                    {  
                      text: "drbrooks@zirchemed.org דואל ", 
                      font: 'ARIELF',
                      alignment: 'right' ,
                      color: '#03746e',
                      fontSize: 10    
                    }
      
                  ]
                ]
      
              }, 
         
               {
                // text: 'מעבדת ציר חמ"ד - בדיקת זרע',  
                text: ' זרע בדיקת - חמ"ד ציר מעבדת ',  
                style:'sectionHeaderH'
              },{
                text: 'Zir Chemed Laboratory - Semen Analysis',  
                style:'sectionHeaderH' 
              },{
                // text: "פרטים אישיים", 
                text: "  אישיים פרטים  ", 
                style: 'sectionHeader',
                direction: 'rtl'
              },
             
              {
                columns: [
                  // {
                  //   text: `${this.persons.womanName}  האשה: שם `, 
                  //   // text: `${this.persons.womanName}  :שם האשה  `, 
                  //   style: 'sectionText',
                  //   direction: 'rtl'
                  // },
                  // {
                  //   text: `${this.persons.manName} הבעל: שם `, 
                  // style: 'sectionText',
                  // direction: 'rtl'
                  // },
                  {
                    text: `${date} תאריך:  `,
                    style: 'sectionText' 
                  },
                  {
                    // text: `${this.persons.addres} ${this.persons.city} :כתובת `, 
                    text: `${this.revers(this.persons.addres+"   "+this.persons.city)}   כתובת:  `, 
                    style: 'sectionText'
                  },
                  {
                    text: `${this.persons.familyName} משפחה: שם `, 
                    style: 'sectionText',
                    direction: 'rtl'
                  }
                ]
              },
                ,
                 
                  {
                    columns: [
                      {
                        text: `${this.persons.manPhone} הבעל: טלפון  מספר  `, 
                     
                      style: 'sectionText'
                      },
                           {
                        text: `${this.persons.manId} הבעל: זהות תעודת `, 
                      style: 'sectionText'
                      }
                    ,  
                        {
                    text: `${this.persons.manName} הבעל: שם `, 
                  style: 'sectionText',
                  direction: 'rtl'
                  }
                      // {
                      //   // text: `${this.persons.manId} :תעודת זהות הבעל  `, 
                      //   text: `${this.persons.womanId} האשה: זהות  תעודת `, 
                       
                      //   style: 'sectionText'
                      // },
                      
                      // {
                      //   text: `  `, 
                      //   style: 'sectionText'
                      // },
                      // {
                      //   text: `${this.persons.manId} הבעל: זהות תעודת `, 
                      // style: 'sectionText'
                      // }
                    ]
                  },
                 
                  {
                    columns: [
                      {
                        // text: `${this.persons.manPhone}: מספר טלפון הבעל `, 
                        text: `${this.persons.womanPhone} האשה: טלפון מספר `,  
                        style: 'sectionText'
                      },
                      {
                        // text: `${this.persons.manId} :תעודת זהות הבעל  `, 
                        text: `${this.persons.womanId} האשה: זהות  תעודת `, 
                       
                        style: 'sectionText'
                      },
                   {
                    text: `${this.persons.womanName}  האשה: שם `, 
                    // text: `${this.persons.womanName}  :שם האשה  `, 
                    style: 'sectionText',
                    direction: 'rtl'
                  },
                    ]
                  },
                  {
                    columns: [
                      {
                        // text: `${this.persons.addres} ${this.persons.city} :כתובת `, 
                        text: "", 
                        style: 'sectionText'
                      },
                     
                      {
                        text:`${this.revers(this.sa.daysAvoided)}  המנעות: ימי `, 
                        style: 'sectionText'
                      },
                      {
                        text: `${this.revers(this.sa.doctorTreatment)}  מפנה: גורם `, 
                      style: 'sectionText'
                      }
                     
                    ]
                  },{
                    columns: [
                      
                      {
                        text: ``, 
                        style: 'sectionText'
                      },
                      {
                        text: `${this.sa.givingTimeString} קבלה: שעת `,
                        style: 'sectionText' 
                      }
                      ,
                      {
                        text: `${this.sa.givingSample} הדוגמית: נתינת שעת `,
                        style: 'sectionText' 
                      }
                   
                    ]
                  }
                ,
                  // { text: `${this.persons.womanName} :שם האשה ${this.persons.manName} :שם הבעל ${this.persons.familyName}:שם משפחה `, 
                  // fontSize: 14,
                  // font: 'ARIELF'},
                  // { text: `${this.persons.addres} ${this.persons.city} :כתובת ${this.persons.womanName} :תעודת זהות האשה ${this.persons.manId}:תעודת זהות הבעל  `, 
                  // fontSize: 14,
                  // font: 'ARIELF'},
                  // { text: `${this.saToSave.doctorTreatment} :רופא מטפל ${this.persons.womanPhone} :מספר טלפון האשה ${this.persons.manPhone}: מספר טלפון הבעל`, 
                  // fontSize: 14,
                  // font: 'ARIELF'},
                  // { text: ` ${this.saToSave.givingTime} :שעת קבלה ${this.clinicVisits.visitsDate}: תאריך`, 
                  // fontSize: 14,
                  // font: 'ARIELF'},
      
               
      
              
              ,{
                text: " נתינה אופן  ",
                style: 'sectionHeader'
              },
              {
                columns:[
                 [ {
                    text: this.sa.fresh?`Fresh : √`:`Fresh :\uf046  `,
                    style: 'sectionText'
                  }
                ],
                [
                  {
                    text: this.sa.condom?`Condom : √ `:`Condom : \uf046`,
                    style: 'sectionText'
                  }
                ]
                ,
                [
                  {
                    text: this.sa.ejac?`Ejac dil: √ `:`Ejac dil :\uf046  `,
                    style: 'sectionText'
                  }
                ]
                ,
                [
                  {
                    text: this.sa.cup?`Cup:√ `:`Cup :\uf046  `,
                    style: 'sectionText'
                  }
                ]
                ,
                [
                  {
                    text: this.sa.other?`other: √ `:`other : \uf046`,
                    style: 'sectionText'
                  }
                ]
                ]
      
      
              },
              {
                text: "ממצאים ",
                style: 'sectionHeader'
              },
              {
                defaultStyle: {
                  font: "Roboto"
                },
                table: {
                  widths: ["30%", "30%", "40%"], // שינוי רוחב העמודות בהתאמה
                  alignment: "right", // מיקום הטבלה לצד השני
                  body: [
                    [
                      { text: "תקינים  ערכים", style: "sectionText", alignment: "right" },
                      { text: "תוצאה", style: "sectionText", alignment: "right" },
                      { text: "ערך", style: "sectionText", alignment: "right" }
                    ],
                    [
                      { text: `מ"ל 1.5 מעל`, style: "sectionText", alignment: "right" },
                      { text: `${this.reversVolumeCc(" "+this.sa.volumeCc+" ")}`, style: "sectionText", alignment: "right" },
                      { text: "volume cc )נפח(", style: "sectionText", alignment: "right" }
                    ],
                    [
                      { text: "", style: "sectionText", alignment: "right" },
                      { text: `${this.revers(" "+this.sa.appearance+" ")}`, style: "sectionText", alignment: "right" },
                      { text: "Appearance )מראה(", style: "sectionText", alignment: "right" }
                    ],
                    [
                      { text: ` זרימה למ"ל זרע תאי מליון 15 לפחות`, style: "sectionText", alignment: "right" },
                      { text: `${this.sa.conc105cc}`, style: "sectionText", alignment: "right" },
                      { text: "conc.10^6/cc )ריכוז(", style: "sectionText", alignment: "right" }
                    ],
                    [
                      { text: "7.2 מעל", style: "sectionText", alignment: "right" },
                      { text: `${this.sa.ph}`, style: "sectionText", alignment: "right" },
                      { text: "pH", style: "sectionText", alignment: "right" }
                    ],
                    [
                      { text: "בתנועה זרע 40% מעל", style: "sectionText", alignment: "right" },
                      { text: `${this.sa.motility}`, style: "sectionText", alignment: "right" },
                      { text: "motility % )תנועה(", style: "sectionText", alignment: "right" }
                    ],
                
                    [
                      { text: "", style: "sectionText", alignment: "right" },
                      { text: `${this.sa.grade}`, style: "sectionText", alignment: "right" },
                      { text: "grade )דרגה(", style: "sectionText", alignment: "right" }
                    ],
                  ]
                },
                layout: "lightHorizontalLines" // מסגרת קלה לטבלה
                
              }
,              
              {
                columns:[
                 [ {
                    text:  `grade 1   ${this.sa.motility_rank_1}    (1 )דרגה `,
                    style: 'sectionText'
                  }
                ],
                [
                  {
                    text: `grade 2   ${this.sa.motility_rank_2}    (2 )דרגה `,
                    style: 'sectionText'
                  }
                ]
                ,
                [
                  {
                    text: `grade 3   ${this.sa.motility_rank_3}    (3 )דרגה `,
                    style: 'sectionText'
                  }
                ]
                ,
                [
                  {
                    text: `grade 4   ${this.sa.motility_rank_4}    (4 )דרגה `,
                    style: 'sectionText'
                  }
                ]
                ,
                
                ]
      
      
              },
        
     
              {
                text: `${this.revers(this.sa.comments)}     הערות: `,
                style:'sectionTextCenter',
                alignment: 'right',
                fontSize: 9.9
              },
              {
                text: "מורפולגיה ", 
                style: 'sectionHeader' 
              },{
              columns:[ 
               {
                  text: ` תקינים. וצורה מבנה הזרע, מתאי ומעלה  4% תקינים: ערכים `,
                  style:'sectionText'
                },
                {
                  text: `Normal forms       ${this.sa.normalForms }        % (who strict) `,
                  style:'sectionText'
                },
            
              ]},
             
              {
                table: {
                  widths: ["33%", "33%", "33%"], // שלוש עמודות שוות ברוחב
                  body: [
                    [
                      { text: [{ text: "Large heads: ", bold: true }, this.sa.largeHeads], style: "sectionTextCenter", border: [true, true, true, true] },
                      { text: [{ text: "Small heads: ", bold: true }, this.sa.smallHeads], style: "sectionTextCenter", border: [true, true, true, true] },
                      { text: [{ text: "Round heads: ", bold: true }, this.sa.roundHeads], style: "sectionTextCenter", border: [true, true, true, true] }
                    ],
                    [
                      { text: [{ text: "Tapered heads: ", bold: true }, this.sa.taperedHeads], style: "sectionTextCenter", border: [true, true, true, true] },
                      { text: [{ text: "Pyramidal heads: ", bold: true }, this.sa.pyramidalHeads], style: "sectionTextCenter", border: [true, true, true, true] },
                      { text: [{ text: "Amorphous heads: ", bold: true }, this.sa.amorphousHeads], style: "sectionTextCenter", border: [true, true, true, true] }
                    ],
                    [
                      { text: [{ text: "Pin heads: ", bold: true }, this.sa.pinHeads], style: "sectionTextCenter", border: [true, true, true, true] },
                      { text: [{ text: "Neck defects: ", bold: true }, this.sa.neckDefects], style: "sectionTextCenter", border: [true, true, true, true] },
                      { text: [{ text: "Cytoplasmic droplets: ", bold: true }, this.sa.cytoplasmicDroplets], style: "sectionTextCenter", border: [true, true, true, true] }
                    ],
                    [
                      { text: [{ text: "Tail defects: ", bold: true }, this.sa.tailDefects], style: "sectionTextCenter", border: [true, true, true, true]},
                      { text: [{ text: "", bold: true }, ], style: "sectionTextCenter", border: [false, false, false, false] },
                      { text: [{ text: "", bold: true }, ], style: "sectionTextCenter", border: [false, false, false,  false]}
                    ]
                  ]
                },
            //    layout: "lightHorizontalLines" // מסגרת קלה לטבלה
              },
              
       
              {
                columns:[
                  {
                    text:  `${this.morphology && this.morphology.employeeIdNumber!=null && this.morphology.employeeIdNumber==15553639?`אמבריולוג   ${this.morphology?this.morphology.employeeName:""}  ידי: על בוצעה  מורפולוגיה `:` מעבדה עובדת  ${this.morphology?this.morphology.employeeName:" "}  ידי: על בוצעה  מורפולוגיה`}`,
                    style:'sectionText',
                    alignment: 'left'
                  },
                  {
                    text: ` מעבדה עובדת  ${this.preformed?this.preformed.employeeName:""}  ידי: על בוצעה בדיקה `,
                    style:'sectionText',
                    alignment: 'right'
                  }
                ]

              },
             
              {
                text:this.revers(` ציר חמד – רחוב פועה 4  ירושלים ~  ת.ד.  34102 91340   ירושלים ~  טל: 1800-240-240 ~  פקס: 02-6510504 `)
             ,style:'sectionzirChemed'
              },
              {
                text: `zirchemed@zirchemed.org ~ www.zirchemed.org`
                ,style:'sectionzirChemed'
              }
      
             
        ] ,  
        styles: {  
          sectionzirChemed: {  
            font: 'ARIELF', 
            color: '#03746e',
            margin: [0, 3.5, 0, 3] ,
            alignment: 'center',
            fontSize: 10 
        },
            sectionHeader: {  
                bold: true,  
                // alignment: 'right',
                alignment: 'center',
                fontSize:12, 
                font: 'ARIELF', 
                margin: [0, 6, 0, 6]  ,
                fillColor: '#00BFFF'
            },
            sectionHeaderH: {  
              bold: true,  
              alignment: 'center',
              fontSize: 13, 
              font: 'ARIELF', 
              margin: [0, 6, 0, 6]  ,
              fillColor: '#00BFFF'
          },
            sectionText: {  
              bold: true,  
              // fontSize: 11, 
              fontSize: 9.75, 
              font: 'ARIELF', 
              margin: [0, 5, 0,5]  ,
              alignment: 'right'
          },
          
            sectionTextCenter: {  
              bold: true,  
              // fontSize: 11, 
              fontSize: 9.75, 
              font: 'ARIELF', 
              margin: [0, 3, 0,3]  ,
              alignment: 'center'
          }
            }
            }   
            let fileName =`${this.persons.manName} ו${this.persons.womanName}  ${this.persons.familyName} ${reversData} SA.pdf` ;
          if(action==='download'){    
            pdfMake.createPdf(docDefinition).download(fileName);    
          }else if(action === 'print'){    
            pdfMake.createPdf(docDefinition).print();          
          }else if(action === 'send'){ 
            let file=pdfMake.createPdf(docDefinition);  
            pdfMake.createPdf(docDefinition).getBase64((encodedString)=> { 
              this.stringPdfToSave = encodedString;
              if(this.persons.manEmail){
              this.emailFrom.controls["manEmail"].setValue(this.persons.manEmail);
            }
            if(this.persons.womanEmail){
              this.emailFrom.controls["womanEmail"].setValue(this.persons.womanEmail);
            }
              this.sending=true;
              this.sendSuccessfully=false;
              this.sendFailed=false;
              this.displayResponsive=true;
              this.waitingForSending=false
              });
          }else{    
            pdfMake.createPdf(docDefinition).open();          
          }    
        }


}


     