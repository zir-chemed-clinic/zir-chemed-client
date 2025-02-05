import { Component, OnInit, Input } from '@angular/core';
import { InseminationService } from '../services/insemination.service';
import { FormGroup, FormControl } from '@angular/forms';
import { InseminationDTO } from '../models/InseminationDTO';
import { EmployeesService } from '../services/employees.service';
import { PersonsService } from '../services/persons.service';
import { ClinicVisitsService } from '../services/clinic-visits.service';
import { PersonsDTO } from '../models/PersonsDTO';
import { EmployeesDTO } from '../models/EmployeesDTO';
import { ClinicVisitsDTO } from '../models/ClinicVisitsDTO';
import { Observable } from 'rxjs';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import {strGnuMICR} from '../../fonts/GnuMICRttfBase64Encoded'
import {strAriel} from '../../fonts/ariel'
import { strLogo } from '../stringLogo';

@Component({
  selector: 'app-insemination',
  templateUrl: './insemination.component.html',
  styleUrls: ['./insemination.component.css']
})
export class InseminationComponent implements OnInit {
  inseminationToSave:InseminationDTO;
  toggleLayer:boolean=false;
  @Input() ClinicVisitsId: number;
  insemination:InseminationDTO;
  clinicVisits:ClinicVisitsDTO;
  doctor:EmployeesDTO;
  date:string= "";
  reversData:string= "";
  closed:Boolean;
  persons:PersonsDTO;
  inseminationform=new FormGroup({
    ManName :  new FormControl(""),
  WomanName : new FormControl(""),
  FamilyName : new FormControl(""),
  ManId : new FormControl(""),
  WomanId : new FormControl(""),
    ManFathersName :  new FormControl(""),
    WomanFathersName : new FormControl(""),
    employeeName: new FormControl(""),
    licenseNumber:new FormControl(""),
    Signature1 : new FormControl(false),
    Signature2 : new FormControl(false),
    Signature3 : new FormControl(false),
    folliclesNumber:new FormControl(""),
    DoctorSignature : new FormControl(false),
    DoctorLicenseNumber : new FormControl(""),
    DoctorSignatureAfter : new FormControl(false),
    TreatmentDescription : new FormControl(""),
    TreatmentsTime: new FormControl("")
  })
  saveInseminationObservable():Observable<InseminationDTO>{
this.inseminationToSave= new InseminationDTO();
if (this.insemination){
  this.inseminationToSave.inseminationId=this.insemination.inseminationId;
}
else{
  this.inseminationToSave.inseminationId=0;
}
this.inseminationToSave.clinicVisitsId=this.ClinicVisitsId;
this.inseminationToSave.signature1=this.inseminationform.controls["Signature1"].value;
this.inseminationToSave.signature2=this.inseminationform.controls["Signature2"].value;
this.inseminationToSave.signature3=this.inseminationform.controls["Signature3"].value;
this.inseminationToSave.doctorSignature=this.inseminationform.controls["DoctorSignature"].value;
this.inseminationToSave.treatmentsTime=this.inseminationform.controls["TreatmentsTime"].value;

this.inseminationToSave.doctorLicenseNumber=+this.inseminationform.controls["DoctorLicenseNumber"].value;
this.inseminationToSave.doctorSignatureAfter=this.inseminationform.controls["DoctorSignatureAfter"].value;
this.inseminationToSave.treatmentDescription=this.inseminationform.controls["TreatmentDescription"].value;
this.inseminationToSave.folliclesNumber=+this.inseminationform.controls["folliclesNumber"].value;
return this._InseminationService.saveInsemination(this.inseminationToSave);
}
  
  saveInsemination(){
    this.toggleLayer=true;
    this.saveInseminationObservable().subscribe(
      (data)=>{
        this.toggleLayer=false;
        this.insemination=data;
        },
     (error)=>{
      this.toggleLayer=false;
        alert("try later");}

    )
  }
  setInsemination(insemination:InseminationDTO){
    debugger
    this.inseminationform.controls["Signature1"].setValue(insemination.signature1);
    this.inseminationform.controls["Signature2"].setValue(insemination.signature2);
    this.inseminationform.controls["Signature3"].setValue(insemination.signature3);
    this.inseminationform.controls["DoctorSignature"].setValue(insemination.doctorSignature);
    this.inseminationform.controls["TreatmentsTime"].setValue(insemination.treatmentsTime);
    this.inseminationform.controls["DoctorLicenseNumber"].setValue(insemination.doctorLicenseNumber);
    this.inseminationform.controls["DoctorSignatureAfter"].setValue(insemination.doctorSignatureAfter);
    this.inseminationform.controls["TreatmentDescription"].setValue(insemination.treatmentDescription);
    this.inseminationform.controls["folliclesNumber"].setValue(insemination.folliclesNumber);
  }
  setPersons(persons:PersonsDTO){
    this.inseminationform.controls["ManName"].setValue(persons.manName);
    this.inseminationform.controls["WomanName"].setValue(persons.womanName);
    this.inseminationform.controls["FamilyName"].setValue(persons.familyName);
    this.inseminationform.controls["ManFathersName"].setValue(persons.manFathersName);
    this.inseminationform.controls["WomanFathersName"].setValue(persons.womanFathersName);
    this.inseminationform.controls["ManId"].setValue(persons.manId);
    this.inseminationform.controls["WomanId"].setValue(persons.womanId);
  }
  setDoctor(doctor:EmployeesDTO){
    this.inseminationform.controls["employeeName"].setValue(doctor.employeeName);
    this.inseminationform.controls["licenseNumber"].setValue(doctor.licenseNumber);
  }
  constructor(private _InseminationService:InseminationService
    ,private _clinicVisitsService:ClinicVisitsService
    ,private _personsService:PersonsService,private _EmployeesService:EmployeesService) { }
  ngOnInit() {
  
   
    this._InseminationService.getByClinicVisitId(this.ClinicVisitsId).subscribe(
      (data)=>{
        if(data){
          debugger
          this.insemination=data;
          this.setInsemination(this.insemination);
        }
 
        },
     (error)=>{alert("try later")}
    )
    this._clinicVisitsService.getById(this.ClinicVisitsId).subscribe(
      (data)=>{
        this.clinicVisits=data;
        this.closed=this.clinicVisits.closed;
        if(this.clinicVisits.visitsDate){
          let arr=this.clinicVisits.visitsDate.toString().split('T')[0].split('-');
          this.date=`${arr[2]}/${arr[1]}/${arr[0]}`;
          this.reversData=`${arr[0]}/${arr[1]}/${arr[2]}`
        }else
        this.date="";
        this._personsService.getById(this.clinicVisits.personsId).subscribe(
          (data)=>{this.persons=data;
            this.setPersons(this.persons)},
          (error)=>{alert("try later")}
          
        )
        this._EmployeesService.getById(this.clinicVisits.doctor).subscribe(
          (data)=>{
            if(data!=null){
            this.doctor=data;
            this.setDoctor(this.doctor)}},
          (error)=>{alert("try later")}
          
        )
      },
     (error)=>{ alert("try later")})


  }


  closeInsemination(action = 'open') { 
    debugger
    this.saveInseminationObservable()
    .subscribe(
        (data)=>{
          this.inseminationToSave=data;
          this.clinicVisits.closed=true;
          this.insemination=data;
          this.closed=true;
          
          
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
       printBeforeClose(action = 'open') { 
          debugger
          this.saveInseminationObservable()
          .subscribe(
              (data)=>{
                this.inseminationToSave=data;
                this.insemination=data;
                this.generatePDF(action);
                },
             (error)=>{ alert("try later");}
        
            )
         
              }
        revers(data){
          return data.split(' ').reverse().join(' ');

        }
        reversD(data){
          return data.split(' ').reverse().join('  ');
        }
        generatePDF(action = 'open'){
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
                text: `${this.revers(" טופס הסכמה  ")}`, 
                style: 'sectionHeaderH'
              }
              ,{
                text:`${this.revers(" הזרעה מלאכותית מזרע בן זוג  ")}` , 
                style: 'sectionHeaderH'
              }
               ,
//                   { text: `
//                   כמות או מאיכות הנובעים  פוריות   ליקוי של במצבים מומלצת  לאשה הזוג בן מזרע  מלאכותית  הזרעה
// מסיבות או ידועה איננה פוריות  לאי כשהסיבה הרחם,  צוואר של  תקין בלתי תפקוד,  הזרע  של  ירודה
// המקרה.  לפי  אחרות
//  הזרע תאי  סטריליים, בתנאים מעבדתי הכנה תהליך הזוג  בן זרימת עוברת ההזרעה  ביצוע  לצורך
//   להזרעה. המוכנים שטופים זרעונים תרחיף קבלת תוך  סטרילית(  תמיסה )לתוך  מבודדים
// תוך או צווארית תוך  הנרתיקית,  בדרך סטרילי קטטר  באמצעות לרחם מוזרק  הזרעונים  תרחיף
//  למחזור  15% כ והם הפוריות לליקויי  בגורמים  תלויים  הטיפול  להצלחת הידועים הסיכויים  רחמית,
// אחד  טיפולי

//                   `, 
             { text:`${this.revers(" הזרעה מלאכותית מזרע בן הזוג לאשה מומלצת במצבים של ליקוי פוריות הנובעים מאיכות או כמות ירודה של")}`,

                  style: 'sectionText'}
                  ,
                  { text:`${this.revers(" הזרע, תפקוד בלתי תקין של צוואר הרחם, כשהסיבה לאי פוריות איננה ידועה או מסיבות אחרות לפי המקרה.")}`,

                  style: 'sectionText'}
                  ,
                  { text:`${this.revers(" לצורך ביצוע ההזרעה עוברת זרימת בן הזוג תהליך הכנה מעבדתי בתנאים סריליים, תאי הזרע מבודדים")}`,

                  style: 'sectionText'}
                  ,
                  { text:`${this.revers(" )לתוך תמיסה סטרילית( תוך קבלת תרחיף זרעונים שטופים המוכנים להזרעה.")}`,

                  style: 'sectionText'}
                  ,
                  { text:`${this.revers(" תרחיף זרעונים מוזרק לרחם באמצעות קטטר סטרילי בדרך הנרתיקית, תוך צווארית או תוך רחמית.")}`,

                  style: 'sectionText'}
                  ,
                  { text:`${this.revers(" הסיכויים הידועים להצלחת הטיפול תלויים בגורמים לליקויי הפוריות והם כ15%  למחזור טיפולי אחד.")}`,

                  style: 'sectionText'}
                  
              ,{
                text: "האישה",
                style: 'sectionHeader',
              },
              {
                columns: [
                  {
                    // text: `  ${this.persons.familyName}:שם משפחה`, 
                    text: ` ${this.revers(this.persons.familyName)}  משפחה:  שם`, 
                    style: 'sectionText',
                    direction: 'rtl'
                  },
                  {
                    // text: `${this.persons.womanName} :שם האשה  `, 
                    text: `${this.revers(this.persons.womanName)} האשה: שם `, 
                  style: 'sectionText',
                  direction: 'rtl'
                  }
                ]
              },
              {
                columns: [
                  {
                    // text: `${this.persons.womanName} :תעודת זהות האשה`, 
                    text: `${this.persons.womanId} האשה: זהות  תעודת`, 
                    style: 'sectionText',
                    direction: 'rtl'
                  },
                  {
                    // text: `${this.persons.womanFathersName} שם האב  `, 
                    text: `${this.revers(this.persons.womanFathersName)} האב: שם  `, 
                  style: 'sectionText',
                  direction: 'rtl'
                  }
                ]
              },
              
            
              {
                text: "הבעל ",
                style: 'sectionHeader'
              },
              {
                columns: [
                  {
                    // text: `${this.persons.familyName}:שם משפחה`, 
                    text: `${this.revers(this.persons.familyName)} משפחה:  שם`,
                    style: 'sectionText',
                    direction: 'rtl'
                  },
                  {
                    // text: `${this.persons.manName} :שם הבעל  `, 
                    text: `${this.revers(this.persons.manName)}  הבעל: שם  `,
                  style: 'sectionText',
                  direction: 'rtl'
                  }
                ]
              },
              {
                columns: [
                  {
                    // text: `${this.persons.manId}:תעודת זהות הבעל`, 
                    text: `${this.persons.manId} הבעל: זהות תעודת `, 
                    style: 'sectionText',
                    direction: 'rtl'
                  },
                  {
                    // text: `${this.persons.manFathersName}: שם האב  `, 
                    text: `${this.revers(this.persons.manFathersName)}  האב: שם `, 
                  style: 'sectionText',
                  direction: 'rtl'
                  }
                ]
              }
              ,
              {
                text: `   `,
                style:'sectionTextCenter'

              },
              // { text: `${this.persons.womanFathersName} שם האב ${this.persons.womanName} :תעודת זהות האשה ${this.persons.womanName} :שם האשה  ${this.persons.familyName}:שם משפחה `, 
              // fontSize: 14,
              // font: 'ARIELF'},
       
             
              // { text: `${this.persons.manFathersName}:תעודת זהות הבעל שם האב ${this.persons.manId}:תעודת זהות הבעל  ${this.persons.manName} :שם הבעל ${this.persons.familyName}:שם משפחה `, 
              //     fontSize: 14,
              //     font: 'ARIELF'},
                  {
                    text: "הצהרה ",
                    style: 'sectionHeader',
                  },{
                    // text: ` נשואים:  זוג כבני וחיים נשואים אנו כי בזאת ומאשרים מצהירים  אנו
                    // ${this.insemination.signature1?`V`:`X`}  הבעל
                    // ${this.insemination.signature1?`V`:`X`}  האישה
                    text: ` נשואים:  זוג כבני וחיים נשואים אנו כי בזאת ומאשרים מצהירים  אנו
                    
                    __________  הבעל

                    __________  האישה  

                    `,
                    style: 'sectionText'
                  },
                  {
                    // text: ` הנוכחי למחזור זקיקים   ${this.insemination.folliclesNumber} על עומד האישה  של  הזקיקים מספר כי מצהירים  אנו
                    // ${this.insemination.signature2?`V`:`X`} הבעל
                    // ${this.insemination.signature2?`V`:`X`} האישה
                    text: ` הנוכחי: למחזור זקיקים   ${this.insemination.folliclesNumber} על עומד האישה  של  הזקיקים מספר כי מצהירים  אנו

                    __________ הבעל
                    
                    __________ האישה
                    `,
                    style: 'sectionText',
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
                    text:this.revers(` ציר חמד – רחוב פועה 4   ירושלים  ~  ת.ד.  34102 91340   ירושלים   ~ טל: 1800-240-240 ~ פקס: 02-6510504  `)
                 ,style:'sectionzirChemed'
                  },
                  {
                    text: `zirchemed@zirchemed.org ~ www.zirchemed.org`
                    ,style:'sectionzirChemed'
                  },
                  {
                    text: `   `,
                    style:'sectionTextCenter'
    
                  },
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
                    text: `   `,
                    style:'sectionTextCenter'
    
                  },
                  {
                    text: " הזוג חתימת  ",
                    // text: "חתימת הזוג ",
                    style: 'sectionHeader'
                  },
                  
  //                  {
  //                   text: ` ברוקס ברוך מד"ר או ברנהולץ אורית מד"ר  פה בעל מפורט הסבר שקיבלתנו בזאת ומאשרים מצהירים אנו   
  //                    הטיפול(  )להלן הצלחתו וסיכויי ביצועו ואופן בכך הכרוכים והטיפולים הבדיקות הזוג בן מזרע הזרעה על  
  //                    כלל  בדרך ופוחתים שהולכים קל ודימום קלים בטן כאבי לרבות:  האפשריות, הלוואי תופעות לנו הוסברו 
  //                    הפנימיים המין באברי זיהום של האפשרי הסיבוך לנו הוסבר כן כמו ההזרעה. לאחר שעות  מספר  תוך
  //                     החצוצרות.  לסתימת יגרום נדירים ומקרים אשפוז ויצריך גבוה חום או ו/ בכאב ילווה שלעיתים  
  //                       כמו תלד, מההזרעה שכתוצאה או תהרה, האשה מההזרעה שכתוצאה ביטחון כל אין כי  לנו הוסבר  
  //                      נפשי או פיזי בריאות במצב ה ילד/ של לידה תיתכן וכן והלידה ההריון בעת  סיבוכים של אפשרות קיימת  כן
  //                      כפי מהרגיל אחרת סטייה כל או תורשתיות נטיות י בעל/ וכן ים נורמלי/ בלתי או  מום, י בעל/ או תקין,  לא
  //                      טבעי. בהריון לקרות עלול  שהדבר
  //                      שהדבר מי בידי יעשה שהטיפול לכך ומסכימים יודעים אנו הטיפול לביצוע הסכמנו את בזאת נותנים  אנו
  //  ובלבד מסוים. אדם בידי חלקם. או כולם שיעשו. לנו הובטח לא וכי והוראות לנהלים בהתאם עליו,  יוטל 
  //  לחוק. בכופף המקובלת באחריות  שיעשו  

  //                   `,
  //                   style: 'sectionText'
                   
  //                 },
                {
                  text:`${this.revers(" אנו מצהירים ומאשרים בזאת שקיבלנו הסבר מפורט מדק' אורית ברנהולץ או מדר' ברוך ברוקס")}`,
                  style: 'sectionText'
                },
                {
                  text:`${this.revers(" על הזרעה מזרע בן הזוג הבדיקות והטיפולים הכרוכים בכך ואופן ביצועו וסיכויי הצלחתו ) להלן הטיפול(")}`,
                  style: 'sectionText'
                },
                {
                  text:`${this.revers(" הוסברו לנו תופעות הלוואי האפשריות, לרבות כאבי בטן קלים ודימום קל שהולכים ופוחתים בדרך כלל")}`,
                  style: 'sectionText'
                },
                {
                  text:`${this.revers(" תוך מספר שעות לאחר ההזרעה. כמו כן הוסבר לנו הסיבוך האפשרי של זיהום באברי המין הפנימיים")}`,
                  style: 'sectionText'
                },
                {
                  text:`${this.revers(" שלעיתים ילווה בכאב ו/ או חום גבוה ויצריך אשפוז ובמקרים נדירים יגרום לסתימת החצוצרות.")}`,
                  style: 'sectionText'
                },
                {
                  text:`${this.revers(" הוסבר לנו כי אין כל בטחון שכתוצאה מההזרעה האשה תהרה, או שכתוצאה מההזרעה היא תלד,")}`,
                  style: 'sectionText'
                },
                {
                  text:`${this.revers(" כמו כן קיימת אפשרות של סיבוכים בעת ההריון והלידה וכן תיתכן לידה של ילד/ ה במצב בריאות פיזי או נפשי")}`,
                  style: 'sectionText'
                },
                {
                  text:`${this.revers(" לא תקין, או  בעל/ י מום, או בלתי נורמלי/ ים וכן בעל/ י נטיות תורשתיות או כל סטייה אחרת מהרגיל")}`,
                  style: 'sectionText'
                },
                {
                  text:`${this.revers(" כפי שהדבר עלול לקרות הריון טבעי.")}`,
                  style: 'sectionText'
                },
                {
                  text:`${this.revers(" אנו נותנים בזאת את הסכמתנו לביצוע הטיפול אנו יודעים ומסכימים לכך שהטיפול יעשה בידי מי שהדבר")}`,
                  style: 'sectionText'
                },
                {
                  text:`${this.revers(" יוטל עליו, בהתאם לנהלים והוראות וכי לא הובטח לנו שיעשו, כולם או חלקם, בידי אדם מסוים,")}`,
                  style: 'sectionText'
                },
                {
                  text:`${this.revers(" ובלבד שיעשו באחריות המקובלת בכפוף לחוק.")}`,
                  style: 'sectionText'
                },
                  {
                    text:`${this.date}   תאריך`,
                    style: 'sectionText'

                  },
                  {
                    columns: [
                      {
                        // text: `${this.insemination.signature3?`V`:`X`} חתימת האישה`,
                        text: `__________  האישה: חתימת `,   
                        style: 'sectionText',
                        direction: 'rtl'
                      },
                      {
                        // text: ` ${this.insemination.signature3?`V`:`X`} חתימת הבעל `,
                        text: `__________  הבעל: חתימת `, 
                      style: 'sectionText',
                      direction: 'rtl'
                      }
                    ]
                  },
                  // {
                  //   text: `   `,
                  //   style:'sectionTextCenter'
    
                  // },
                  {
                    // text: "חתימת הרופא/ה",
                    text: ' ה הרופא/  חתימת',
                    style: 'sectionHeader'
                  },
                  {
                    text:`${this.revers(" אני מאשר כי הסברתי בעל פה לפני הזוג את כל האמור לעיל בפירוט הדרוש וכי הם חתמו על הסכמה בפני לאחר ששוכנעתי")}`,
                    style: 'sectionText'
                  },
                  {
                    text:`${this.revers(" כי הבינו את הסברי המלאים.")}`,
                    style: 'sectionText'
                  },
                  {
                    columns: [
                      {
                        text: ` ${this.doctor? this.revers(this.doctor.employeeName):" "} ה: הרופא/  שם`, 
                        style: 'sectionText',
                        direction: 'rtl'
                      },
                      {
                        // text: `${this.insemination.doctorSignature?`V`:`X`} ה: הרופא/  חתימת `, 
                        text: `__________ ה: הרופא/  חתימת `, 
                      style: 'sectionText',
                      direction: 'rtl'
                      },
                      {
                        text: `     ${this.doctor?this.doctor.licenseNumber:""} רשיון: מספר  `, 
                      style: 'sectionText',
                      direction: 'rtl'
                      }
                    ]
                  },
                  {
                    text: `   `,
                    style:'sectionTextCenter'
    
                  },
                  {
                    text: " ה הרופא/  סיכום ",
                    style: 'sectionHeader'
                  },
                  // {
                  //   text:  ` הטיפול התבצע ביום 
                  //   ${this.date.getTime()}  בשעה
                  //   ${this.insemination.treatmentDescription} : מהלך הטיפול -קל, קשה,הערות
                  
                  //   ${this.doctor.employeeName} שם הרופא/ה
                  //   ${this.insemination.doctorSignatureAfter?`V`:`X`} חתימת הרופא/ה
                  //   ${this.doctor.licenseNumber} מס' רישיון
                  //   `,
                  //   fontSize: 15, 
                  //   font: 'ARIELF'
                  // },
                  {
                    columns: [
                      
                      {
                        text: `${this.insemination.treatmentsTime}    בשעה: `, 
                      style: 'sectionText',
                      direction: 'rtl'
                      },
                      {
                        text: `   `,
                        style:'sectionText'
        
                      },
                      {
                        // text: ` הטיפול התבצע ביום `, 
                        text: `${this.date} ביום: התבצע הטיפול `, 
                        style: 'sectionText',
                        direction: 'rtl'
                      }
                    ]
                  },
                  {
                    // text: `  ${this.insemination.treatmentDescription} : מהלך הטיפול -קל, קשה,הערות`, 
                    // text: `  ${this.insemination.treatmentDescription}     הערות(  קשה,  )קל, הטיפול מהלך  `, 
                    text: `הטיפול: מהלך  `,
                  style: 'sectionText',
                  direction: 'rtl'
                  },
                  {
                    // text: `  ${this.insemination.treatmentDescription} : מהלך הטיפול -קל, קשה,הערות`, 
                    // text: `  ${this.insemination.treatmentDescription}     הערות(  קשה,  )קל, הטיפול מהלך  `, 
                    text: `${this.reversD(this.insemination.treatmentDescription)}`,
                  style: 'sectionText',
                  direction: 'rtl'
                  },
                  {
                    columns: [
                      {
                        text: `  ${this.doctor? this.revers(this.doctor.employeeName):""} ה: הרופא/  שם `, 
                        style: 'sectionText',
                        direction: 'rtl'
                      },
                      {
                        // text: ` ${this.insemination.doctorSignatureAfter?`V`:`X`} ה: הרופא/  חתימת `, 
                      text: `__________ ה: הרופא/  חתימת `, 
                      style: 'sectionText',
                      direction: 'rtl'
                      }
                      ,
                      {
                        text: `   ${this.doctor?this.doctor.licenseNumber:" "} רשיון: מספר `, 
                      style: 'sectionText',
                      direction: 'rtl'
                      },
                    ]
                  },
                   // {
                  //   text: `   `,
                  //   style:'sectionTextCenter'
    
                  // },
                 
                  {
                    text:this.revers(` ציר חמד – רחוב פועה 4   ירושלים  ~  ת.ד.  34102 91340   ירושלים   ~ טל: 1800-240-240 ~ פקס: 02-6510504  `)
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
                alignment: 'right',
                fontSize:14, 
                font: 'ARIELF', 
                margin: [0, 8, 0, 8]  ,
                fillColor: '#00BFFF',
               
            },
            sectionHeaderH: {  
              bold: true,  
              alignment: 'center',
              fontSize: 16, 
              font: 'ARIELF', 
              margin: [0, 8, 0, 8]  ,
              fillColor: '#00BFFF'
          },
            sectionText: {  
              bold: true, 
               
              fontSize: 11, 
              font: 'ARIELF', 
              margin: [0, 5, 0,5]  ,
              alignment: 'right'
          },
          
            sectionTextCenter: {  
              bold: true,  
              fontSize: 11, 
              font: 'ARIELF', 
              margin: [0, 3, 0,3]  ,
              alignment: 'center'
          }
            }
            }   
            
            let fileName =`${this.persons.manName} ו${this.persons.womanName}  ${this.persons.familyName} ${this.reversData} Insermination .pdf` ;
          if(action==='download'){    
            pdfMake.createPdf(docDefinition).download(fileName);    
          }else if(action === 'print'){    
            pdfMake.createPdf(docDefinition).print();          
          }else{    
            pdfMake.createPdf(docDefinition).open();          
          }    
        }


}
