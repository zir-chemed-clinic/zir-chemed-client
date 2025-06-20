import { Component, OnInit, Input } from '@angular/core';
import { IuiService } from '../services/iui.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IuiDTO } from '../models/IuiDTO';
import { ClinicVisitsService } from '../services/clinic-visits.service';
import { EmployeesService } from '../services/employees.service';
import { PersonsService } from '../services/persons.service';
import { ClinicVisitsDTO } from '../models/ClinicVisitsDTO';
import { PersonsDTO } from '../models/PersonsDTO';
import { EmployeesDTO } from '../models/EmployeesDTO';
import {MatDialog} from '@angular/material/dialog';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import {strGnuMICR} from '../../fonts/GnuMICRttfBase64Encoded'
import {strAriel} from '../../fonts/ariel'
import { Observable } from 'rxjs';
import {strLogo} from '../stringLogo'
import { EmailService } from '../services/email.service';
import { Form } from '../models/Form';
import { InseminationDTO } from '../models/InseminationDTO';
import { InseminationService } from '../services/insemination.service';
import { log } from 'console';
@Component({
  selector: 'app-iui',
  templateUrl: './iui.component.html',
  styleUrls: ['./iui.component.css']
})
export class IuiComponent implements OnInit {
  @Input() ClinicVisitsId: number;
  @Input() flag: Boolean=false;
  iui:IuiDTO;
  clinicVisits:ClinicVisitsDTO;
  insemination:InseminationDTO;
  toggleLayer:boolean=false;
  persons:PersonsDTO;
  doctor:EmployeesDTO;
  preformed:EmployeesDTO;
  iuiToSave:IuiDTO;
  displayResponsive:boolean=false;
  animal: string;
  name: string;
  stringPdfToSave:string;
  interval;
  from:Form=new Form()
  emailFrom=new FormGroup({
    email :  new FormControl("",[Validators.email]),
    manEmail :  new FormControl("",[Validators.email]),
    womanEmail :  new FormControl("",[Validators.email])
  })
sendSuccessfully:boolean=false;
sendFailed:boolean=false;
sending:boolean=true;
emailNotValid:boolean=false;
messege:boolean=true;
  closed:Boolean=false;
  waitingForSending:boolean=false;
  iuiform=new FormGroup({
  ManName :  new FormControl(""),
  WomanName : new FormControl(""),
  FamilyName : new FormControl(""),
  ManId : new FormControl(""),
  WomanId : new FormControl(""),
  ManPhone : new FormControl(""),
  WomanPhone : new FormControl(""),
  DoctorTreatment :  new FormControl("",[Validators.required]),
  Fresh :  new FormControl(false),
  Condom : new FormControl(false),
  Ejac : new FormControl(false),
  Cup : new FormControl(false),
  Other : new FormControl(""),
  GivingTime : new FormControl(""),
  GivingTimeString : new FormControl(""),
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
  Comments : new FormControl(""),
  WimUp : new FormControl(false),
  Gradient: new FormControl(false),
  Wash : new FormControl(false),
  OtherTreatment  : new FormControl(false),
  CommentsTreatment : new FormControl(""),
  VolumeCcAfterTreatment : new FormControl(""),
  Conc105ccAfterTreatment : new FormControl(""),
  MotilityAfterTreatment : new FormControl(""),
  MotilityAfterTreatment_1 : new FormControl(""),
  MotilityAfterTreatment_2 : new FormControl(""),
  MotilityAfterTreatment_3 : new FormControl(""),
  MotilityAfterTreatment_4 : new FormControl(""),
  GradeAfterTreatment : new FormControl(""),
  pHAfterTreatment: new FormControl(""),
  TotalMotileCount : new FormControl(""),
  EmailForSendingResults : new FormControl(""),
  folliclesNumber : new FormControl("")
  
  })
 

  showResponsiveDialog(){
    this.displayResponsive=true;
  }

  saveIuiObservable():Observable<IuiDTO>{

    this.iuiToSave= new IuiDTO();
    if(this.iui){
      this.iuiToSave.iuiid=this.iui.iuiid;
    }
    else{
      this.iuiToSave.iuiid=0;
    }
    this.iuiToSave.clinicVisitsId=this.ClinicVisitsId;
    this.iuiToSave.fresh=this.iuiform.controls["Fresh"].value;
    this.iuiToSave.condom=this.iuiform.controls["Condom"].value;
    this.iuiToSave.ejac=this.iuiform.controls["Ejac"].value;
    this.iuiToSave.cup=this.iuiform.controls["Cup"].value;
    this.iuiToSave.other=this.iuiform.controls["Other"].value.toString();
    
    this.iuiToSave.doctorTreatment=this.iuiform.controls["DoctorTreatment"].value.toString();
    // this.iuiToSave.GivingTime=this.iuiform.controls["GivingTime"].value;
    this.iuiToSave.givingTime=new Date();
    if(this.iuiform.controls["GivingTimeString"].value){
    this.iuiToSave.givingTimeString=this.iuiform.controls["GivingTimeString"].value.toString();
  }
  else{
    this.iuiToSave.givingTimeString=" "
  }
    this.iuiToSave.volumeCc=this.iuiform.controls["VolumeCc"].value.toString();
    this.iuiToSave.appearance=this.iuiform.controls["Appearance"].value.toString();
    this.iuiToSave.conc105cc=this.iuiform.controls["Conc105cc"].value.toString();
    this.iuiToSave.motility=this.iuiform.controls["Motility"].value.toString();
    this.iuiToSave.motility_rank_1=this.iuiform.controls["Motility_rank_1"].value.toString();
    this.iuiToSave.motility_rank_2=this.iuiform.controls["Motility_rank_2"].value.toString();
    this.iuiToSave.motility_rank_3=this.iuiform.controls["Motility_rank_3"].value.toString();
    this.iuiToSave.motility_rank_4=this.iuiform.controls["Motility_rank_4"].value.toString();
    this.iuiToSave.grade=this.iuiform.controls["Grade"].value.toString();
    this.iuiToSave.comments=this.iuiform.controls["Comments"].value.toString();
    this.iuiToSave.wimUp=this.iuiform.controls["WimUp"].value;
    this.iuiToSave.gradient=this.iuiform.controls["Gradient"].value;
    this.iuiToSave.wash=this.iuiform.controls["Wash"].value;
    this.iuiToSave.otherTreatment=this.iuiform.controls["OtherTreatment"].value;
    this.iuiToSave.ph=this.iuiform.controls["Ph"].value;
    
    // this.iuiToSave.otherTreatment=true;
    this.iuiToSave.commentsTreatment=this.iuiform.controls["CommentsTreatment"].value;
    this.iuiToSave.volumeCcAfterTreatment=this.iuiform.controls["VolumeCcAfterTreatment"].value.toString();
    this.iuiToSave.conc105ccAfterTreatment=this.iuiform.controls["Conc105ccAfterTreatment"].value.toString();
    this.iuiToSave.motilityAfterTreatment=this.iuiform.controls["MotilityAfterTreatment"].value.toString();
    this.iuiToSave.motilityAfterTreatment_1=this.iuiform.controls["MotilityAfterTreatment_1"].value.toString();
    this.iuiToSave.motilityAfterTreatment_2=this.iuiform.controls["MotilityAfterTreatment_2"].value.toString();
    this.iuiToSave.motilityAfterTreatment_3=this.iuiform.controls["MotilityAfterTreatment_3"].value.toString();
    this.iuiToSave.motilityAfterTreatment_4=this.iuiform.controls["MotilityAfterTreatment_4"].value.toString();
    this.iuiToSave.gradeAfterTreatment=this.iuiform.controls["GradeAfterTreatment"].value.toString();
    // this.iuiToSave.phAfterTreatment=this.iuiform.controls["pHAfterTreatment"].value.toString();
    
    this.iuiToSave.totalMotileCount=this.iuiform.controls["TotalMotileCount"].value.toString();
    this.iuiToSave.emailForSendingResults=this.iuiform.controls["EmailForSendingResults"].value.toString();
    this.iuiToSave.folliclesNumber=this.iuiform.controls["folliclesNumber"].value.toString();    

    
  return  this._IuiService.saveIui(this.iuiToSave);
  }
  saveInseminationObservable():Observable<InseminationDTO>{
   
    this.insemination.folliclesNumber=parseInt(this.iuiform.controls["folliclesNumber"].value);  
console.log(this.insemination.folliclesNumber+"insemination");

return this._InseminationService.saveInsemination(this.insemination);
    }
  saveInsemination(){
  
      this.toggleLayer=true;
      this.saveInseminationObservable().subscribe(
        (data)=>{
          this.insemination=data;
          console.log("ins"+this.insemination.folliclesNumber);
          
          },
       (error)=>{
        this.toggleLayer=false;
        console.log("insemination");
        
          alert("try later");}
  
      )
    }
  
  saveIUI(){
    this.toggleLayer=true;
    this.insemination.folliclesNumber=this.iuiform.controls["folliclesNumber"].value.toString();  
    console.log(this.insemination.folliclesNumber); 
this.saveInsemination();
this._InseminationService.saveInsemination(this.insemination);
    this.saveIuiObservable().subscribe(
      (data)=>{
        this.toggleLayer=false;
        this.iui=data
        },
     (error)=>{ 
      this.toggleLayer=false;
      console.log("iui");
      
       alert("try later");}

    )
  }
  setPersons(persons:PersonsDTO){
    this.iuiform.controls["ManName"].setValue(persons.manName);
    this.iuiform.controls["WomanName"].setValue(persons.womanName);
    this.iuiform.controls["FamilyName"].setValue(persons.familyName);
    this.iuiform.controls["ManId"].setValue(persons.manId);
    this.iuiform.controls["WomanId"].setValue(persons.womanId);
    this.iuiform.controls["ManPhone"].setValue(persons.manPhone);
    this.iuiform.controls["WomanPhone"].setValue(persons.womanPhone);
  }
  setoctor(doctor:EmployeesDTO){
    this.iuiform.controls["DoctorTreatment"].setValue(doctor.employeeName);
  }
  setIui(iui:IuiDTO){
    this.iuiform.controls["Fresh"].setValue(iui.fresh);
    this.iuiform.controls["Condom"].setValue(iui.condom);
    this.iuiform.controls["Ejac"].setValue(iui.ejac);
    this.iuiform.controls["Cup"].setValue(iui.cup);
    this.iuiform.controls["Other"].setValue(iui.other);
    this.iuiform.controls["GivingTime"].setValue(iui.givingTime);
    this.iuiform.controls["GivingTimeString"].setValue(iui.givingTimeString);
    this.iuiform.controls["VolumeCc"].setValue(iui.volumeCc);
    this.iuiform.controls["Appearance"].setValue(iui.appearance);
    this.iuiform.controls["Conc105cc"].setValue(iui.conc105cc);
    this.iuiform.controls["Motility"].setValue(iui.motility);
    this.iuiform.controls["Motility_rank_1"].setValue(iui.motility_rank_1);
    this.iuiform.controls["Motility_rank_2"].setValue(iui.motility_rank_2);
    this.iuiform.controls["Motility_rank_3"].setValue(iui.motility_rank_3);
    this.iuiform.controls["Motility_rank_4"].setValue(iui.motility_rank_4);
    this.iuiform.controls["Grade"].setValue(iui.grade);
    this.iuiform.controls["Comments"].setValue(iui.comments);
    this.iuiform.controls["WimUp"].setValue(iui.wimUp);
    this.iuiform.controls["Gradient"].setValue(iui.gradient);
    this.iuiform.controls["Wash"].setValue(iui.wash);
    this.iuiform.controls["Ph"].setValue(iui.ph);
    this.iuiform.controls["OtherTreatment"].setValue(iui.otherTreatment);
    this.iuiform.controls["CommentsTreatment"].setValue(iui.commentsTreatment);
    this.iuiform.controls["VolumeCcAfterTreatment"].setValue(iui.volumeCcAfterTreatment);
    this.iuiform.controls["Conc105ccAfterTreatment"].setValue(iui.conc105ccAfterTreatment);
    this.iuiform.controls["MotilityAfterTreatment"].setValue(iui.motilityAfterTreatment);
    this.iuiform.controls["MotilityAfterTreatment_1"].setValue(iui.motilityAfterTreatment_1);
    this.iuiform.controls["MotilityAfterTreatment_2"].setValue(iui.motilityAfterTreatment_2);
    this.iuiform.controls["MotilityAfterTreatment_3"].setValue(iui.motilityAfterTreatment_3);
    this.iuiform.controls["MotilityAfterTreatment_4"].setValue(iui.motilityAfterTreatment_4);
    this.iuiform.controls["GradeAfterTreatment"].setValue(iui.gradeAfterTreatment);
    this.iuiform.controls["pHAfterTreatment"].setValue(iui.phAfterTreatment);
    this.iuiform.controls["TotalMotileCount"].setValue(iui.totalMotileCount);
    this.iuiform.controls["EmailForSendingResults"].setValue(iui.emailForSendingResults);
    this.iuiform.controls["DoctorTreatment"].setValue(iui.doctorTreatment); 
    this.iuiform.controls["folliclesNumber"].setValue(iui.folliclesNumber);
    
  }
  
  constructor(private _IuiService:IuiService,private _clinicVisitsService:ClinicVisitsService
    ,private _personsService:PersonsService,private _EmployeesService:EmployeesService,public dialog: MatDialog
    ,private _EmailService:EmailService, private _InseminationService:InseminationService) { }
  ngOnInit() {
    this._IuiService.getByClinicVisitId(this.ClinicVisitsId).subscribe(
      (data)=>{
        if(data){
          this.iui=data;
          this.setIui(this.iui);
        }
 
        },
     (error)=>{console.log(error)}
    )
    this._clinicVisitsService.getById(this.ClinicVisitsId).subscribe(
      (data)=>{
        this.clinicVisits=data;
        this.closed=this.clinicVisits.closedIUI;
        if(this.closed){
          clearInterval(this.interval);
        }
        this._personsService.getById(this.clinicVisits.personsId).subscribe(
          (data)=>{this.persons=data;
            this.setPersons(this.persons)},
          (error)=>{alert("try later")}
          
        )
        this._InseminationService.getByClinicVisitId(this.ClinicVisitsId).subscribe(
          (data)=>{
            if(data){
              debugger
              this.insemination=data;
            }
     
            },
         (error)=>{alert("try later")}
        )
        this._EmployeesService.getById(this.clinicVisits.doctor).subscribe(
          (data)=>{
            this.doctor=data;
          },
          (error)=>{
            alert("try later")
          }
        )
        this._EmployeesService.getById(this.clinicVisits.preformed).subscribe(
          (data)=>{
            this.preformed=data;
          },
          (error)=>{
            alert("try later")
          }
        )
      },
     (error)=>{ alert("try later")})
     this.interval = setInterval(() => {
this.saveIUI()
    },180000)



  }
  ngOnDestroy() {
      clearInterval(this.interval);

  }
  closeIUI(action = 'open') { 
    this.saveIuiObservable()
    .subscribe(
        (data)=>{
          this.iui=data;
          this.clinicVisits.closedIUI=true;
         
          this._clinicVisitsService.saveClinicVisit(this.clinicVisits)
          .subscribe(
            (data)=>{
              this.closed=data.closedIUI;
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
      // validateEmail(email) {
      //     const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      //     return re.test(String(email).toLowerCase());
      // }
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
                this.sendSuccessfully=true;
                this.waitingForSending=false;
              }
              else{
                this.sendFailed=true;
                this.waitingForSending=false;
              }
            
            },
            (err)=>
            {
            this.sendFailed=true;
            }
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
          let tel="טל"
            if(this.clinicVisits.visitsDate){
              let arr=this.clinicVisits.visitsDate.toString().split('T')[0].split('-');
              date=`${arr[2]}/${arr[1]}/${arr[0]}`;
              reversData=`${arr[0]}/${arr[1]}/${arr[2]}`
            }
            else date="";
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
                      text:` 02-6535395 ${tel}`, 
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
                text: this.revers(' מעבדת ציר חמ"ד - השבחת זרע'),  
                style:'sectionHeaderH'
              },{
                text: 'Zir Chemed Laboratory - Sperm Treatment',  
                style:'sectionHeaderH' 
              },{
                text: this.revers(" פרטים אישיים "), 
                style: 'sectionHeader'
              },	{
                columns: [
                  {
                    text: ` ${this.persons.womanName}  האשה:  שם `, 
                    // text: `${this.persons.womanName}  :שם האשה  `, 
                    style: 'sectionText'
                  },
                  {
                    text: `${this.persons.manName}  הבעל: שם `, 
                  style: 'sectionText'
                  },
                  {
                    text: `${this.persons.familyName} משפחה: שם `, 
                    style: 'sectionText'
                  }
                ]
              },
                ,
                 
                  {
                    columns: [
                      {
                        text: `${this.persons.womanId} האשה: זהות מספר `, 
                        style: 'sectionText'
                      },
                      {
                        text: `  `, 
                        style: 'sectionText'
                      },
                      {
                        text: `${this.persons.manId} הבעל: זהות מספר  `, 
                      
                      style: 'sectionText'
                      }
                    ]
                  },
                 
                  {
                    columns: [
                      {
                        text: `${this.persons.womanPhone} האשה: טלפון מספר `, 
                        style: 'sectionText'
                      },
                      {
                        text: `  `, 
                        style: 'sectionText'
                      },
                      {
                        text: `${this.persons.manPhone} הבעל: טלפון מספר `, 
                
                      style: 'sectionText'
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        // text: `${this.revers(this.persons.addres)} ${this.revers(this.persons.city)}  כתובת: `,
                        text: `${this.revers(this.persons.addres+"   "+this.persons.city)}   כתובת:  `,  
                        style: 'sectionText'
                      },
                      {
                        text: `  `, 
                        style: 'sectionText'
                      },
                      {
                        text: `${this.revers(this.iui.doctorTreatment)} מפנה: גורם `, 
                      style: 'sectionText'
                      }
                     
                    ]
                  },
                  {
                    columns: [
                     
                      {
                        
                        text:  ` ${this.iui.folliclesNumber?this.iui.folliclesNumber:""} זקיקים: מספר `,
                        style: 'sectionText' 
                      }
                      ,{
                        text: `${this.iui.givingTimeString} קבלה: שעת `, 
                        style: 'sectionText'
                      },
                      {
                        text: `  ${date}: תאריך `, 
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
                  // { text: `:רופא מטפל ${this.persons.womanPhone} :מספר טלפון האשה ${this.persons.manPhone}: מספר טלפון הבעל`, 
                  // fontSize: 14,
                  // font: 'ARIELF'},
                  // { text: ` ${this.iui.givingTime} :שעת קבלה ${this.clinicVisits.visitsDate}: תאריך`, 
                  // fontSize: 14,
                  // font: 'ARIELF'},
      
               
      
              
              ,{
                text: "נתינה אופן ",
                style: 'sectionHeader'
              },
              {
                columns:[
                 [ {
                    text: this.iui.fresh?`Fresh : √ `:`Fresh : \uf046`
                    ,style: 'sectionText'
                  }
                ],
                [
                  {
                    text: this.iui.condom?`Condom : √ `:`Condom : \uf046 `
                    ,style: 'sectionText'
                  }
                ]
                ,
                [
                  {
                    text: this.iui.ejac?`Ejac dil: √ `:`Ejac dil : \uf046 `
                    ,style: 'sectionText'
                  }
                ]
                ,
                [
                  {
                    text: this.iui.cup?`Cup: √ `:`Cup : \uf046 `
                    ,style: 'sectionText'
                  }
                ]
                ,
                [
                  {
                    text: this.iui.other?`other: √ `:`other : \uf046 `
                    ,style: 'sectionText'
                  }
                ]
                ]
      
      
              },


              
              {
                text: "ממצאים   ",
                style: 'sectionHeader'
              },
              // {
              //   text: `)נפח(        ${this.iui.volumeCc}        volume cc`,
              //  style:'sectionTextCenter'
              // },
              // {
              //   text: `)מראה(        ${this.iui.appearance}        Appearance`,
              //   style:'sectionTextCenter'
              // },
              // {
              //   text: `)ריכוז(        ${this.iui.conc105cc}        conc.10/5 /cc`,
              //   style:'sectionTextCenter'
              // },
              // {
              //   text: `)תנועה(        ${this.iui.motility}        motility %`,
              //   style:'sectionTextCenter'
              // },
              // {
              //   text: `)דרגה(      ${this.iui.grade}       grade`,
              //   style:'sectionTextCenter'
              // },
              // {
              //   text: `PH       ${this.iui.ph}`,
              //   style:'sectionTextCenter'
              // },
              {
                columns: [
                  {
                    text: "", 
                    style: 'sectionText'
                  },   
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  
                  {
                    text: "", 
                  style: 'sectionText'
                  },
                  {
                    text: `)נפח(`, 
                    style: 'sectionText'
                  }
                  ,
                  {
                    text: `${this.reversVolumeCc(" "+this.iui.volumeCc+" ")}   `, 
                    style: 'sectionText',
                    alignment: 'center'
                  }
                  ,
                  {
                    text: `volume cc`, 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  }
                  ,
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  }
                ]
              },
              {
                columns: [
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                    {
                    text: "", 
                    style: 'sectionText'
                  },
                  
                  {
                    text: "", 
                  style: 'sectionText'
                  },
                  {
                    text: `)מראה(`, 
                    style: 'sectionText'
                  }
                  ,
                  {
                    text: `${this.revers(" "+this.iui.appearance+" ")}   `, 
                    style: 'sectionText',
                    alignment: 'center'
                  }
                  ,
                  {
                    text: `Appearance`, 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  }
                  ,
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  }
                ]
              },
              {
                columns: [
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                  style: 'sectionText'
                  },
                  {
                    text: `)ריכוז(`, 
                    style: 'sectionText'
                  }
                  ,
                  {
                    text: `${this.iui.conc105cc}`, 
                    style: 'sectionText',
                    alignment: 'center'
                  }
                  ,
                  {
                    text: `conc.10^6/cc`, 
                    style: 'sectionText',
                    fontSize: 9
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  }
                  ,
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  }
                ]
              },
              {
                columns: [
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                  style: 'sectionText'
                  },
                  {
                    text: `)דרגה(`, 
                    style: 'sectionText'
                  }
                  ,
                  {
                    text: `${this.iui.grade}`, 
                    style: 'sectionText',
                    alignment: 'center'
                  }
                  ,
                  {
                    text: `grade`, 
                    style: 'sectionText',
                    fontSize: 9
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  }
                  ,
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  }
                ]
              },
              // {
              //   columns: [
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //     style: 'sectionText'
              //     },
              //     {
              //       text: `)תנועה(`, 
              //       style: 'sectionText'
              //     }
              //     ,
              //     {
              //       text: ` ${this.iui.motility}`, 
              //       style: 'sectionText',
              //       alignment: 'center'
              //     }
              //     ,
              //     {
              //       text: `motility %`, 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     }
              //     ,
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     }
              //   ]
              // },
              // {
              //   columns: [
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //     style: 'sectionText'
              //     },
              //     {
              //       text: `)תנועה(`, 
              //       style: 'sectionText'
              //     }
              //     ,
              //     {
              //       text: ` ${this.iui.motility_rank_2}`, 
              //       style: 'sectionText',
              //       alignment: 'center'
              //     }
              //     ,
              //     {
              //       text: `motility % דרגה 2`, 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     }
              //     ,
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     }
              //   ]
              // },
              // {
              //   columns: [
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //     style: 'sectionText'
              //     },
              //     {
              //       text: `)תנועה(`, 
              //       style: 'sectionText'
              //     }
              //     ,
              //     {
              //       text: ` ${this.iui.motility_rank_3}`, 
              //       style: 'sectionText',
              //       alignment: 'center'
              //     }
              //     ,
              //     {
              //       text: `motility % דרגה 3`, 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     }
              //     ,
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     }
              //   ]
              // },
              // {
              //   columns: [
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //     style: 'sectionText'
              //     },
              //     {
              //       text: `)תנועה(`, 
              //       style: 'sectionText'
              //     }
              //     ,
              //     {
              //       text: ` ${this.iui.motility_rank_4}`, 
              //       style: 'sectionText',
              //       alignment: 'center'
              //     }
              //     ,
              //     {
              //       text: `motility %דרגה  4`, 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     }
              //     ,
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     },
              //     {
              //       text: "", 
              //       style: 'sectionText'
              //     }
              //   ]
              // },
              ,{
                text: ` motility % ${this.iui.motility}   תנועה  `,
                style: 'sectionText',
                alignment: 'center'
              },
              {
                columns:[
                 [ {
                    text:  `grade 1   ${this.iui.motility_rank_1}    (1 )דרגה `,
                    style: 'sectionText'
                  }
                ],
                [
                  {
                    text: `grade 2   ${this.iui.motility_rank_2}    (2 )דרגה `,
                    style: 'sectionText'
                  }
                ]
                ,
                [
                  {
                    text: `grade 3   ${this.iui.motility_rank_3}    (3 )דרגה `,
                    style: 'sectionText'
                  }
                ]
                ,
                [
                  {
                    text: `grade 4   ${this.iui.motility_rank_4}    (4 )דרגה `,
                    style: 'sectionText'
                  }
                ]
                ,
                
                ]
      
      
              },
              
              {
                text: `${this.revers(this.iui.comments)} הערות: `,
               style:'sectionTextCenter',
               alignment: 'right' 
              },
              {
                text: "Treatment - טיפול  ", 
                style: 'sectionHeader' 
              },
              {
                columns:[
                 [ {
                    text: this.iui.wimUp?`Swim Up : √ `:`Swim Up :\uf046 `
                    ,style: 'sectionText'
                  }
                ],
                [
                  {
                    text: this.iui.gradient?`Gradient : √ `:`Gradient :\uf046  `
                    ,style: 'sectionText'
                  }
                ]
                ,
                [
                  {
                    text: this.iui.wash?`Wash: √ `:`Wash : \uf046 `
                    ,style: 'sectionText'
                  }
                ]
                ,
                [
                  {
                    text: this.iui.other?`Other: √ `:`Other : \uf046 `
                    ,style: 'sectionText'
                  }
                ]
                
                ]
      
      
              },
              {
                text: ` ${this.revers(this.iui.commentsTreatment)}   הערות: `,
                style:'sectionTextCenter',
                alignment: 'right' 
              },
              {
                text: "After Treatment - טיפול אחרי ",
                style: 'sectionHeader' 
              },
              {
                columns: [
                  {
                    text: "", 
                    style: 'sectionText'
                  },   
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  
                  {
                    text: "", 
                  style: 'sectionText'
                  },
                  {
                    text: `)נפח(`, 
                    style: 'sectionText'
                  }
                  ,
                  {
                    text: `${this.reversVolumeCc(" "+this.iui.volumeCcAfterTreatment+" ")}   `, 
                    style: 'sectionText',
                    alignment: 'center'
                  }
                  ,
                  {
                    text: `volume cc`, 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  }
                  ,
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  }
                ]
              },
             
              {
                columns: [
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                  style: 'sectionText'
                  },
                  {
                    text: `)ריכוז(`, 
                    style: 'sectionText'
                  }
                  ,
                  {
                    text: `${this.iui.conc105ccAfterTreatment}`, 
                    style: 'sectionText',
                    alignment: 'center'
                  }
                  ,
                  {
                    text: `conc.10^6/cc`, 
                    style: 'sectionText',
                    fontSize: 9
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  }
                  ,
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  }
                ]
              },
              {
                columns: [
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                  style: 'sectionText'
                  },
                  {
                    text: `)דרגה(`, 
                    style: 'sectionText'
                  }
                  ,
                  {
                    text: `${this.iui.grade}`, 
                    style: 'sectionText',
                    alignment: 'center'
                  }
                  ,
                  {
                    text: `grade`, 
                    style: 'sectionText',
                    fontSize: 9
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  }
                  ,
                  {
                    text: "", 
                    style: 'sectionText'
                  },
                  {
                    text: "", 
                    style: 'sectionText'
                  }
                ]
              },
             
              ,{
                text: ` motility % ${this.iui.motilityAfterTreatment}    תנועה  `,
                style: 'sectionText',
                alignment: 'center'
              },
              {
                columns:[
                 [ {
                    text:  `grade 1   ${this.iui.motilityAfterTreatment_1}    (1 )דרגה `,
                    style: 'sectionText'
                  }
                ],
                [
                  {
                    text: `grade 2   ${this.iui.motilityAfterTreatment_2}    (2 )דרגה `,
                    style: 'sectionText'
                  }
                ]
                ,
                [
                  {
                    text: `grade 3   ${this.iui.motilityAfterTreatment_3}    (3 )דרגה `,
                    style: 'sectionText'
                  }
                ]
                ,
                [
                  {
                    text: `grade 4   ${this.iui.motilityAfterTreatment_4}    (4 )דרגה `,
                    style: 'sectionText'
                  }
                ]
                ,
                
                ]
      
      
              },
              // {
              //   columns: [
              //     {
              //       columns: [{
              //         text: ` )נפח(`, 
              //         style: 'sectionText'

              //       },{
              //         text: `${this.reversVolumeCc(" "+this.iui.volumeCcAfterTreatment+" ")}`, 
              //         style: 'sectionText',
              //         alignment: 'center'

              //       },{
              //         text: `volume cc`, 
              //         style: 'sectionText'

              //       }]
                   
              //     },
              //     {
              //       text:`   `,
              //       style: 'sectionText'
              //     },
              //     {
              //       columns:[
              //       {
              //         text: `)תנועה(`,
              //         style: 'sectionText' 

              //       },
              //       {
              //         text: `${this.iui.motilityAfterTreatment}`,
              //         style: 'sectionText' ,
              //         alignment: 'center'

              //       },
              //       {
              //         text: `motility % דרגה 1`,
              //         style: 'sectionText' 

              //       }]
              //     },
              //     {
              //       columns:[
              //       {
              //         text: `)תנועה(`,
              //         style: 'sectionText' 

              //       },
              //       {
              //         text: `${this.iui.motilityAfterTreatment_2}`,
              //         style: 'sectionText' ,
              //         alignment: 'center'

              //       },
              //       {
              //         text: `motility % דרגה 2`,
              //         style: 'sectionText' 

              //       }]
              //     },
              //     {
              //       columns:[
              //       {
              //         text: `)תנועה(`,
              //         style: 'sectionText' 

              //       },
              //       {
              //         text: `${this.iui.motilityAfterTreatment_3}`,
              //         style: 'sectionText' ,
              //         alignment: 'center'

              //       },
              //       {
              //         text: `motility % דרגה 3`,
              //         style: 'sectionText' 

              //       }]
              //     },
              //     {
              //       columns:[
              //       {
              //         text: `)תנועה(`,
              //         style: 'sectionText' 

              //       },
              //       {
              //         text: `${this.iui.motilityAfterTreatment_4}`,
              //         style: 'sectionText' ,
              //         alignment: 'center'

              //       },
              //       {
              //         text: `motility % דרגה 4`,
              //         style: 'sectionText' 

              //       }]
              //     }
              //   ]
              // },
              // {
              //   columns: [
              //     {
              //       columns:[
              //         {
              //           text: `)ריכוז(`,
              //           style: 'sectionText'

              //         },
              //         {
              //           text: `${this.iui.conc105ccAfterTreatment}`,
              //           style: 'sectionText',
              //           alignment: 'center'

              //         },
              //         {
              //           text: `conc.10^6/cc`,
              //           style: 'sectionText',
              //           fontSize: 9

              //         }]
                    
              //     },
                  
              //     {
              //       text:`   `,
              //       style: 'sectionText'
              //     },
              //     {
              //       columns:[
              //         {
              //           text: `)דרגה(`,
              //           style: 'sectionText' 

              //         },
              //         {
              //           text: `${this.iui.gradeAfterTreatment}`,
              //           style: 'sectionText' ,
              //           alignment: 'center'

              //         },
              //         {
              //           text: `grade`,
              //           style: 'sectionText' 
              //         }
              //       ]
                    
              //     }
              //   ]
              // },
              {
                columns: [
                  // {
                  //   text: `PH       ${this.iui.phAfterTreatment} `,
                  //   style: 'sectionText' 
                  // },
                  {
                    text: `   `,
                    style: 'sectionText' 
                  },
                  {
                    text:`Total motile count*10^6       ${this.iui.totalMotileCount}`,
                    style: 'sectionText'
                  },
                  {
                    text: ``,
                    style: 'sectionText' 
                  }
                ]
              },
          // {
          //   columns:[
          //     {
          //       text: ` ${this.doctor?this.doctor.licenseNumber:""}  רשיון: מספר   ${this.doctor?this.doctor.employeeName:""}  רופא:  ידי על בוצע ההזרעה  `,
          //       style:'sectionTextCenter'
          //       ,
          //       alignment: 'left'

          //     },
          //     {
          //       text: ` מעבדה עובדת ${this.preformed?this.preformed.employeeName:""}   ידי: על בוצע השבחה `,
          //       style:'sectionTextCenter'
          //       ,
          //       alignment: 'right'

          //     },
          //   ]

          // },
              {
                text: ` ${this.doctor?this.doctor.licenseNumber:""}  רשיון: מספר   ${this.doctor?this.doctor.employeeName:""}  רופא:  ידי על בוצע ההזרעה  `,
                style:'sectionTextCenter'
                ,
                alignment: 'left'

              },
              {
                text: ` מעבדה עובדת ${this.preformed?this.preformed.employeeName:""}   ידי: על בוצע השבחה `,
                style:'sectionTextCenter'
                ,
                alignment: 'left'

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
                margin: [0, 8, 0, 8]  ,
                fillColor: '#00BFFF'
            },
            sectionHeaderH: {  
              bold: true,  
              alignment: 'center',
              fontSize: 13, 
              font: 'ARIELF', 
              margin: [0, 8, 0, 8]  ,
              fillColor: '#00BFFF'
          },
            sectionText: {  
              bold: true,  
              fontSize: 9.2, 
              font: 'ARIELF', 
              margin: [0, 5, 0,5]  ,
              alignment: 'right'
          },
          
            sectionTextCenter: {  
              bold: true,  
              fontSize: 9.2, 
              font: 'ARIELF', 
              margin: [0, 3, 0,3]  ,
              alignment: 'center'
          }
            }
           }  
           let fileName =`${this.persons.manName} ו${this.persons.womanName}  ${this.persons.familyName} ${reversData} IUI .pdf` ;
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
              this.waitingForSending=false
              this.sendSuccessfully=false;
              this.sendFailed=false;
              this.displayResponsive=true;
              });
          }
          else{    
            pdfMake.createPdf(docDefinition).open();          
          }    
        }


}

