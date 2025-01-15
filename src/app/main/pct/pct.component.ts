import { Component, OnInit, Input } from '@angular/core';
import { PctService } from '../services/pct.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PctDTO } from '../models/PctDTO';
import { ClinicVisitsService } from '../services/clinic-visits.service';
import { EmployeesService } from '../services/employees.service';
import { PersonsService } from '../services/persons.service';
import { ClinicVisitsDTO } from '../models/ClinicVisitsDTO';
import { PersonsDTO } from '../models/PersonsDTO';
import { EmployeesDTO } from '../models/EmployeesDTO';
import  jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import {strGnuMICR} from '../../fonts/GnuMICRttfBase64Encoded'
import {strAriel} from '../../fonts/ariel'
import { Observable } from 'rxjs';
import {strLogo} from '../stringLogo'
import { Form } from '../models/Form';
import { EmailService } from '../services/email.service';
@Component({
  selector: 'app-pct',
  templateUrl: './pct.component.html',
  styleUrls: ['./pct.component.css']
})
export class PctComponent implements OnInit {
pctToSave:PctDTO;
toggleLayer:boolean=false;
pctId:number=0;
@Input() 
ClinicVisitsId: number;
   clinicVisits:ClinicVisitsDTO;
  persons:PersonsDTO;
  doctor:EmployeesDTO;
  pct:PctDTO;
  closed:Boolean=false;
  interval;
  pctform=new FormGroup({
    ManName :  new FormControl(""),
  WomanName : new FormControl(""),
  FamilyName : new FormControl(""),
  ManId : new FormControl(""),
  WomanId : new FormControl(""),
  ManPhone : new FormControl(""),
  WomanPhone : new FormControl(""),
  DoctorTreatment :  new FormControl("",[Validators.required]),
  EmployeeName :  new FormControl(""),
  MensesDay : new FormControl(""),
  HoursPost : new FormControl(""),
  TotalSpermsHpf : new FormControl(""),
  GoodMotileSperm : new FormControl(""),
  Elasticity : new FormControl(""),
  Clarity : new FormControl(""),
  Amount : new FormControl(""),
  Cellularity : new FormControl(""),
  Fernig : new FormControl(""),
  Comments : new FormControl(""),
  })
  sendSuccessfully:boolean=false;
  sendFailed:boolean=false;
  sending:boolean=true;
  displayResponsive:boolean=false;
  stringPdfToSave:string;
  waitingForSending:boolean=false;
  from:Form=new Form()
  emailFrom=new FormGroup({
    email :  new FormControl("",[Validators.email]),
    manEmail :  new FormControl("",[Validators.email]),
    womanEmail :  new FormControl("",[Validators.email])
  })
  setPctform(pct:PctDTO){
    this.pctform.controls["EmployeeName"].setValue(pct.employeeName);
    this.pctform.controls["DoctorTreatment"].setValue(pct.doctorTreatment);
    this.pctform.controls["MensesDay"].setValue(pct.mensesDay);
    this.pctform.controls["HoursPost"].setValue(pct.hoursPost);
    this.pctform.controls["TotalSpermsHpf"].setValue(pct.totalSpermsHpf);
    this.pctform.controls["GoodMotileSperm"].setValue(pct.goodMotileSperm);
    this.pctform.controls["Elasticity"].setValue(pct.elasticity);
    this.pctform.controls["Clarity"].setValue(pct.clarity);
    this.pctform.controls["Amount"].setValue(pct.amount);
    this.pctform.controls["Cellularity"].setValue(pct.cellularity);
    this.pctform.controls["Fernig"].setValue(pct.fernig);
    this.pctform.controls["Comments"].setValue(pct.comments);

  }
  savePctObservable():Observable<PctDTO>{
    this.pctToSave=new PctDTO();
    this.pctToSave.pctid=this.pctId;
    this.pctToSave.clinicVisitsId=this.ClinicVisitsId;
    this.pctToSave.mensesDay= this.pctform.controls["MensesDay"].value.toString();
    this.pctToSave.doctorTreatment= this.pctform.controls["DoctorTreatment"].value.toString();
    this.pctToSave.hoursPost= this.pctform.controls["HoursPost"].value.toString();
    this.pctToSave.totalSpermsHpf= this.pctform.controls["TotalSpermsHpf"].value.toString();
    this.pctToSave.goodMotileSperm= this.pctform.controls["GoodMotileSperm"].value.toString();
    this.pctToSave.elasticity= this.pctform.controls["Elasticity"].value.toString();
    this.pctToSave.clarity= this.pctform.controls["Clarity"].value.toString();
    this.pctToSave.amount= this.pctform.controls["Amount"].value.toString();
    this.pctToSave.cellularity= this.pctform.controls["Cellularity"].value.toString();
    this.pctToSave.fernig= this.pctform.controls["Fernig"].value.toString();
    this.pctToSave.comments= this.pctform.controls["Comments"].value.toString();
   return this._PctService.savePct(this.pctToSave);
  }
  savePct(){
    this.toggleLayer=true;
    this.savePctObservable().subscribe(
      (data)=>{
        this.toggleLayer=false;
        this.pct=data
        this.pctId= this.pct.pctid;
        },
     (error)=>{
      this.toggleLayer=false;
        alert("try later");}

    )
  }
  setPersons(persons:PersonsDTO){
    this.pctform.controls["ManName"].setValue(persons.manName);
    this.pctform.controls["WomanName"].setValue(persons.womanName);
    this.pctform.controls["FamilyName"].setValue(persons.familyName);
    this.pctform.controls["ManId"].setValue(persons.manId);
    this.pctform.controls["WomanId"].setValue(persons.womanId);
    this.pctform.controls["ManPhone"].setValue(persons.manPhone);
    this.pctform.controls["WomanPhone"].setValue(persons.womanPhone);
  }
  setPct(pct:PctDTO){
    this.pctform.controls["MensesDay"].setValue(pct.mensesDay);
    this.pctform.controls["DoctorTreatment"].setValue(pct.doctorTreatment);
    this.pctform.controls["HoursPost"].setValue(pct.hoursPost);
    this.pctform.controls["TotalSpermsHpf"].setValue(pct.totalSpermsHpf);
    this.pctform.controls["GoodMotileSperm"].setValue(pct.goodMotileSperm);
    this.pctform.controls["Elasticity"].setValue(pct.elasticity);
    this.pctform.controls["Clarity"].setValue(pct.clarity);
    this.pctform.controls["Amount"].setValue(pct.amount);
    this.pctform.controls["Cellularity"].setValue(pct.cellularity);
    this.pctform.controls["Fernig"].setValue(pct.fernig);
    this.pctform.controls["Comments"].setValue(pct.comments);
   
  }
  setoctor(doctor:EmployeesDTO){
    this.pctform.controls["DoctorTreatment"].setValue(doctor.employeeName);
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
    this.from.treatments=true;
    this.waitingForSending=true;
    this._EmailService.sendEmail(this.from).subscribe(
      (data)=>{
        if(data){
          this.waitingForSending=false;
          this.sendSuccessfully=true;
       
        }
        else{
          this.waitingForSending=false;
          this.sendFailed=true;
        }
      
      },
      (err)=>
      {
      this.sendFailed=true;
      }
    )
  }
  

  ngOnInit() {
    this._PctService.getByClinicVisitId(this.ClinicVisitsId).subscribe(
      // לבדוק מה קורה אם לא מוצא לאן זה מגיע לדטה או לארור
      (data)=>{
        if(data){
        this.pct=data;
        this.pctId= this.pct.pctid;
        this.setPct(this.pct)
       }
       
      },
      (err)=>{ console.log("err"+err)}
    )
    this._clinicVisitsService.getById(this.ClinicVisitsId).subscribe(
      (data)=>{
        this.clinicVisits=data;
        this.closed=this.clinicVisits.closed;
        if(this.closed){
          clearInterval(this.interval);
        }
        this._personsService.getById(this.clinicVisits.personsId).subscribe(
          (data)=>{this.persons=data;
            this.setPersons(this.persons)},
          (error)=>{alert("try later")}
          
        )
        this._EmployeesDTO.getById(this.clinicVisits.doctor).subscribe(
          (data)=>{
            this.doctor=data;
            // this.setoctor(this.doctor);
          },
          (error)=>{alert("try later")}
        )
      },
     (error)=>{ alert("try later")})
     this.interval = setInterval(() => {
      this.savePct()
          },180000)
  }
  ngOnDestroy() {
    clearInterval(this.interval);

}
  constructor(private _PctService :PctService,private _clinicVisitsService:ClinicVisitsService
    ,private _personsService:PersonsService,private _EmployeesDTO:EmployeesService,private _EmailService:EmailService) { }
    closeIUI(action = 'open') { 
      this.savePctObservable()
      .subscribe(
          (data)=>{
            this.pct=data;
            this.clinicVisits.closed=true;
           
            this._clinicVisitsService.saveClinicVisit(this.clinicVisits)
            .subscribe(
              (data)=>{
                this.generatePDF(action);
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
                        fontSize: 10  
                           
                      }, 
                      {  
                        text: "Dr. Baruch Brooks, Ph.D" , 
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
                        fontSize: 10  
                      }, 
                      {  
                        text: this.revers("  דר ברוך ברוקס ph.D") , 
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
        
                }
                // ,   {table: {
                  // headers are automatically repeated if the table spans over multiple pages
                  // you can declare how many rows should be treated as headers
                  // headerRows: 1,
              //     // widths: [ '*', 'auto', 100, '*' ],
          
              //     body: [
              //       [ {text: 'Bold value', bold: true,   fillColor:'#7e7e7e'},{
              //         columns: [
              //           {
              //             text:` ${this.persons.womanName}  האשה:  שם `, 
              //             // text: `${this.persons.womanName}  :שם האשה  `, 
              //             style: 'sectionText'
              //           },
              //           {
              //             text: `${this.persons.manName}  הבעל: שם `, 
              //           style: 'sectionText'
              //           },
              //           {
              //             text: `${this.persons.familyName}  משפחה: שם `, 
              //             style: 'sectionText'
              //           }
              //         ]
              //       } ],
              //       // [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
              //       // [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
              //     ]
              //   }
              // }
              ,
                {
                  text: 'Zir Chemed Laboratory - Cx:Score – P.C.T', 
                  style:'sectionHeaderH' 
               
                },{
                  text: `   `,
                  style:'sectionTextCenter'
  
                },{
                  text: this.revers("פרטים  אישיים"), 
                  style: 'sectionHeader',
                  direction: 'rtl' ,
                  alignment: 'center'
                  // fontSize: 15,
                
                },	{
                  columns: [
                    {
                      text:` ${this.persons.womanName}  האשה:  שם `, 
                      // text: `${this.persons.womanName}  :שם האשה  `, 
                      style: 'sectionText'
                    },
                    {
                      text: `${this.persons.manName}  הבעל: שם `, 
                    style: 'sectionText'
                    },
                    {
                      text: `${this.persons.familyName}  משפחה: שם `, 
                      style: 'sectionText'
                    }
                  ]
                },
                  ,
                   
                    {
                      columns: [
                        {
                          text: `${this.persons.manId} הבעל: זהות מספר  `, 
                          style: 'sectionText'
                        },
                        {
                          text: `   `,
                          style:'sectionTextCenter'
          
                        },
                        {
                          text: `${this.persons.womanName} האשה: זהות מספר `, 
                        style: 'sectionText'
                        }
                      ]
                    },
                   
                    {
                      columns: [
                        {
                          text: `${this.persons.manPhone} הבעל: טלפון מספר  `, 
                          style: 'sectionText'
                        },
                        {
                          text: `   `,
                          style:'sectionTextCenter'
          
                        },
                        {
                          text: `${this.persons.womanPhone} האשה: טלפון מספר `, 
                        style: 'sectionText'
                        }
                      ]
                    },
                    {
                      columns: [
                        {
                          // text: `${ this.revers(this.persons.addres)} ${this.revers(this.persons.city)}  : כתובת `, 
                          text: `${this.revers(this.persons.addres+"   "+this.persons.city)}   כתובת:  `, 
                          style: 'sectionText'
                        },
                        {
                          text: `   `,
                          style:'sectionTextCenter'
          
                        },
                        {
                          text: `${this.revers(this.pct.doctorTreatment)} מפנה: גורם `, 
                        style: 'sectionText'
                        }
                       
                      ]
                    },
                    {
                      columns: [
                        {
                          text: ` ${date} : תאריך `, 
                          style: 'sectionText'
                        }
                      ]
                    }
                     // { text: `${this.persons.womanName}  :שם האשה  ${this.persons.manName}  :שם הבעל  ${this.persons.familyName}  :שם משפחה `, 
                    // style: 'sectionText' },
                  //   { text: `${this.persons.addres} ${this.persons.city} :כתובת ${this.persons.womanName} :תעודת זהות האשה ${this.persons.manId}:תעודת זהות הבעל  `, 
                  //   fontSize: 14,
                  // style:'sectionText'},
                  //   { text: ` :רופא מטפל ${this.persons.womanPhone} :מספר טלפון האשה ${this.persons.manPhone}: מספר טלפון הבעל`, 
                  //   style: 'sectionText'},
                  //   { text: ` ${this.clinicVisits.visitsDate}: תאריך`, 
                  //   style: 'sectionText'},
        
                  ,{
                    text: `   `,
                    style:'sectionTextCenter'
    
                  },
        
                ,{
                  text: "Cx:Score – P.C.T",
                  style: 'sectionHeader' ,
                  alignment: 'center'
                },{
                  text: `   `,
                  style:'sectionTextCenter'
  
                },
                {
                  text: `${this.revers(" "+this.pct.mensesDay+" ")}      במחזור: יום `,
                  style: 'sectionText'
                },
                {
                  text: ` ${this.revers(" "+this.pct.hoursPost+" ")}      : Hours Post Coitus `,
                  style: 'sectionText'
                },
                {
                  text: ` ${this.revers(" "+this.pct.totalSpermsHpf+" ")}     : Total Sperms/ HPF`,
                  style: 'sectionText'
                },
                {
                  text: `${this.revers(" "+this.pct.goodMotileSperm+" ")}      :Good Motile Sperm`,
                  style: 'sectionText'
                },
                {
                  text: `${this.revers(this.pct.elasticity)}     : אלסטיות`,
                  style: 'sectionText'
                },
                {
                  text: `${this.pct.clarity}     : Clarity`,
                  style: 'sectionText'
                },
                {
                  text: `${this.pct.amount}     : Amount`,
                  style: 'sectionText'
                },
                {
                  text: `${this.pct.cellularity}     : Cellularity`,
                  style: 'sectionText'
                },
                {
                  text: `${this.pct.fernig}     : Fernig`,
                  style: 'sectionText'
                },
                {
                  text: `   : Notes`,
                  style: 'sectionText'
                }, {
                  text: `${this.revers(this.pct.comments)}     `,
                  style:'sectionText'
  
                }, {
                  text: `   `,
                  style:'sectionTextCenter'
  
                }, {
                  text: `   `,
                  style:'sectionTextCenter'
  
                },
                {
                  text: `   `,
                  style:'sectionTextCenter'
  
                },{
                  text: `   `,
                  style:'sectionTextCenter'
  
                },{
                  text: `   `,
                  style:'sectionTextCenter'
  
                },
                {
                  text: `   `,
                  style:'sectionTextCenter'
  
                }, 
                {
                  text: `   `,
                  style:'sectionTextCenter'
  
                },
                {
                  text: `   `,
                  style:'sectionTextCenter'
  
                },
                  {
                  text:this.revers(` ציר חמד – רחוב פועה 4  ירושלים ~  ת.ד.  34102 91340   ירושלים ~  טל: 1800-240-240 ~  פקס: 02-6510504 `)
               ,style:'sectionzirChemed'
                },
                {
                  text: `zirchemed@zirchemed.org ~ www.zirchemed.org`
                  ,style:'sectionzirChemed'
                }
               
            
        
               
          ],  
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
                  alignment: 'right',
                  fontSize: 13, 
                  font: 'ARIELF', 
                  margin: [0, 10, 0, 10]  ,
                  fillColor: '#00BFFF'
              },
              sectionHeaderH: {  
                bold: true,  
                alignment: 'center',
                fontSize: 16, 
                font: 'ARIELF', 
                margin: [0, 10, 0, 10]  ,
                fillColor: '#00BFFF'
            },
              sectionText: {  
                bold: true,  
                fontSize: 11, 
                font: 'ARIELF', 
                margin: [0, 5, 0,5]  ,
                alignment: 'right'
            }

          }   
              }   
              let fileName =`${this.persons.manName} ו${this.persons.womanName}  ${this.persons.familyName} ${reversData} PCT.pdf` ;
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
            }
            else{    
              pdfMake.createPdf(docDefinition).open();          
            }    
          }
  
}

