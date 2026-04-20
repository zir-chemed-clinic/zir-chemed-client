import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Form } from '../models/Form';
import { PersonsDTO } from '../models/PersonsDTO';
import { Observable } from 'rxjs';
import { DnaDTO } from '../models/DnaDTO';
import { DnaService } from '../services/dna-service';
import { ClinicVisitsService } from '../services/clinic-visits.service';
import { ClinicVisitsDTO } from '../models/ClinicVisitsDTO';
import { PersonsService } from '../services/persons.service';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import {strGnuMICR} from '../../fonts/GnuMICRttfBase64Encoded';
import {strAriel} from '../../fonts/ariel';
import {strLogo} from '../stringLogo'
import { log } from 'console';

@Component({
  selector: 'app-dna',
  templateUrl: './dna.component.html',
  styleUrls: ['./dna.component.css']
})
export class DnaComponent implements OnInit {
  @Input() ClinicVisitsId: number;
    closed:Boolean=false;
  toggleLayer:boolean=false;
dnaToSave:DnaDTO;
  dnaId:number=0;
  dna:DnaDTO;
  clinicVisits:ClinicVisitsDTO;
  persons:PersonsDTO;
dnaform=new FormGroup({
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
    Volume : new FormControl(""),
    Count : new FormControl(""),
    Concentration : new FormControl(""),
    PercentMotile : new FormControl(""),
    Progression_1 : new FormControl(""),
    Progression_2 : new FormControl(""),
    Progression_3 : new FormControl(""),
    Progression_4 : new FormControl(""),
    Dfi : new FormControl(""),
    Appearance : new FormControl(""),
    Ph: new FormControl(""),
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
  interval;
    setPersons(persons:PersonsDTO){
      this.dnaform.controls["ManName"].setValue(persons.manName);
      this.dnaform.controls["WomanName"].setValue(persons.womanName);
      this.dnaform.controls["FamilyName"].setValue(persons.familyName);
      this.dnaform.controls["ManId"].setValue(persons.manId);
      this.dnaform.controls["WomanId"].setValue(persons.womanId);
      this.dnaform.controls["ManPhone"].setValue(persons.manPhone);
      this.dnaform.controls["WomanPhone"].setValue(persons.womanPhone);
    }
      setDna(dna:DnaDTO){
        // this.saform.controls["GivingTime"].setValue(sa.givingTime);
        this.dnaform.controls["Fresh"].setValue(dna.fresh);
        this.dnaform.controls["Condom"].setValue(dna.condom);
        this.dnaform.controls["DoctorTreatment"].setValue(dna.doctorTreatment);
        this.dnaform.controls["Ejac"].setValue(dna.ejac);
        this.dnaform.controls["Cup"].setValue(dna.cup);
        this.dnaform.controls["Other"].setValue(dna.other);
        // let t=sa.givingTime.toString().split("T")[1]
        // let str=sa.givingTimeString.split(' ')[4].substring(0,5)
        // this.saform.controls["GivingTimeString"].setValue(new Date('2017-03-08T00:00:00+05:44'));
        // this.givingTime=sa.givingTime;
        this.dnaform.controls["Volume"].setValue(dna.volume)
        this.dnaform.controls["Count"].setValue(dna.count)
        this.dnaform.controls["Concentration"].setValue(dna.concentration)
        this.dnaform.controls["PercentMotile"].setValue(dna.percentMotile);
        this.dnaform.controls["Progression_1"].setValue(dna.progression_1);
        this.dnaform.controls["Progression_2"].setValue(dna.progression_2);
        this.dnaform.controls["Progression_3"].setValue(dna.progression_3);
        this.dnaform.controls["Progression_4"].setValue(dna.progression_4);
        this.dnaform.controls["Dfi"].setValue(dna.dfi);
        this.dnaform.controls["Appearance"].setValue(dna.appearance);
        this.dnaform.controls["Ph"].setValue(dna.ph)

      }
  constructor(private _DnaService:DnaService, private _clinicVisitsService:ClinicVisitsService, private _personsService:PersonsService) { }

  ngOnInit() {
        this._DnaService.getByClinicVisitId(this.ClinicVisitsId).subscribe(
      (data)=>{
        if(data){
        this.dna=data;
        this.dnaId=this.dna.dnaID;
        console.log(this.dna);
        console.log(this.dna.appearance);
        
        this.setDna(this.dna);
     
      }},

      (err)=>{}
    )
     this._clinicVisitsService.getById(this.ClinicVisitsId).subscribe(
      (data)=>{
        this.clinicVisits=data;
        this.closed=this.clinicVisits.closedDNA;
        this._personsService.getById(this.clinicVisits.personsId).subscribe(
          (data)=>{this.persons=data;
            this.setPersons(this.persons)},
          (error)=>{alert("try later")}
          
        )
       
      },
     (error)=>{ alert("try later")})
    
  
  }

      saveDnaObservable():Observable<DnaDTO>{
    
        
      this.dnaToSave= new DnaDTO();
   
      this.dnaToSave.dnaID=this.dnaId;
      this.dnaToSave.clinicVisitsId=this.ClinicVisitsId;

    //   if(this.saform.controls["GivingTimeString"].value){
    //   this.saToSave.givingTimeString= this.saform.controls["GivingTimeString"].value.toString();
    // }
    // else{
    //   this.saToSave.givingTimeString=" "
    // }
    // if(this.saform.controls["GivingSample"].value){
    //   this.saToSave.givingSample= this.saform.controls["GivingSample"].value.toString();
    // }
    // else{
    //   this.saToSave.givingSample=" "
    // }
   
      this.dnaToSave.doctorTreatment= this.dnaform.controls["DoctorTreatment"].value.toString();
      this.dnaToSave.fresh= this.dnaform.controls["Fresh"].value;
      this.dnaToSave.condom= this.dnaform.controls["Condom"].value;
      this.dnaToSave.ejac= this.dnaform.controls["Ejac"].value;
      this.dnaToSave.cup= this.dnaform.controls["Cup"].value;
      this.dnaToSave.other= this.dnaform.controls["Other"].value.toString();
      this.dnaToSave.volume= this.dnaform.controls["Volume"].value.toString();
      this.dnaToSave.count= this.dnaform.controls["Count"].value.toString();
      this.dnaToSave.concentration= this.dnaform.controls["Concentration"].value.toString();
      this.dnaToSave.percentMotile= this.dnaform.controls["PercentMotile"].value.toString();
      this.dnaToSave.progression_1= this.dnaform.controls["Progression_1"].value.toString();
      this.dnaToSave.progression_2= this.dnaform.controls["Progression_2"].value.toString();
      this.dnaToSave.progression_3= this.dnaform.controls["Progression_3"].value.toString();   
      this.dnaToSave.progression_4= this.dnaform.controls["Progression_4"].value.toString();   
      this.dnaToSave.dfi= this.dnaform.controls["Dfi"].value.toString();   
      this.dnaToSave.appearance= this.dnaform.controls["Appearance"].value.toString();
      this.dnaToSave.ph= this.dnaform.controls["Ph"].value.toString();
console.log(this.dnaToSave);
    return  this._DnaService.saveDna(this.dnaToSave);
    }
saveDna(){
   this.toggleLayer=true;
    this.saveDnaObservable()
    .subscribe(
        (data)=>{
          this.dna=data;
          this.dnaId=this.dna.dnaID;
          this.toggleLayer=false;
          
          
          },
       (error)=>{ 
        this.toggleLayer=false;
         alert("try later");}
  
      )
}
closeDna(action = 'open') { 
   
    this.saveDnaObservable()
    .subscribe(
        (data)=>{
          this.dnaToSave=data;
          this.dna=data;          
          this.clinicVisits.closedDNA=true;
          this.clinicVisits.closed=true;
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
                        text: ' הלוספרם בדיקת  - חמ"ד ציר מעבדת ',  
                        style:'sectionHeaderH'
                      },{
                        text: 'Zir Chemed Laboratory - DNA defragmentation',  
                        style:'sectionHeaderH' 
                      },{
                        // text: "פרטים אישיים", 
                        text: "  אישיים פרטים  ", 
                        style: 'sectionHeader',
                        direction: 'rtl'
                      },
                     
                      {
                        columns: [
                      
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
                                text: "", 
                                style: 'sectionText'
                              },
                             
                              // {
                              //   text:`${this.revers(this.sa.daysAvoided)}  המנעות: ימי `, 
                              //   style: 'sectionText'
                              // },
                              {
                                text: `${this.revers(this.dna.doctorTreatment)}  מפנה: גורם `, 
                              style: 'sectionText'
                              }
                             
                            ]
                          },
                          //{
                          //   columns: [
                              
                          //     {
                          //       text: ``, 
                          //       style: 'sectionText'
                          //     },
                          //     {
                          //       text: `${this.sa.givingTimeString} קבלה: שעת `,
                          //       style: 'sectionText' 
                          //     }
                          //     ,
                          //     {
                          //       text: `${this.sa.givingSample} הדוגמית: נתינת שעת `,
                          //       style: 'sectionText' 
                          //     }
                           
                          //   ]
                          // }
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
                            text: this.dna.fresh?`Fresh : √`:`Fresh :\uf046  `,
                            style: 'sectionText'
                          }
                        ],
                        [
                          {
                            text: this.dna.condom?`Condom : √ `:`Condom : \uf046`,
                            style: 'sectionText'
                          }
                        ]
                        ,
                        [
                          {
                            text: this.dna.ejac?`Ejac dil: √ `:`Ejac dil :\uf046  `,
                            style: 'sectionText'
                          }
                        ]
                        ,
                        [
                          {
                            text: this.dna.cup?`Cup:√ `:`Cup :\uf046  `,
                            style: 'sectionText'
                          }
                        ]
                        ,
                        [
                          {
                            text: this.dna.other?`other: √ `:`other : \uf046`,
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
                              { text: `2.0-6.0`, style: "sectionText", alignment: "right" },
                              { text: `${this.dna.volume}`, style: "sectionText", alignment: "right" },
                              { text: "Volume )נפח(", style: "sectionText", alignment: "right" }
                            ],
                            [
                              { text: `> 30Million`, style: "sectionText", alignment: "right" },
                              { text: `${this.dna.count}`, style: "sectionText", alignment: "right" },
                              { text: "Count )כמות(", style: "sectionText", alignment: "right" }
                            ],
                              [
                              { text: "7.2 מעל", style: "sectionText", alignment: "right" },
                              { text: `${this.dna.ph}`, style: "sectionText", alignment: "right" },
                              { text: "pH", style: "sectionText", alignment: "right" }
                            ],
                            [
                              { text: "", style: "sectionText", alignment: "right" },
                              { text: `${this.revers(" "+this.dna.appearance+" ")}`, style: "sectionText", alignment: "right" },
                              { text: "Appearance )מראה(", style: "sectionText", alignment: "right" }
                            ],
                            [
                              { text: `> 15Million`, style: "sectionText", alignment: "right" },
                              { text: `${this.dna.concentration}`, style: "sectionText", alignment: "right" },
                              { text: "Concentration )ריכוז(", style: "sectionText", alignment: "right" }
                            ],
                            [
                              { text: ">50%", style: "sectionText", alignment: "right" },
                              { text: `${this.dna.percentMotile}`, style: "sectionText", alignment: "right" },
                              { text: "Percent Motile )תנועה(", style: "sectionText", alignment: "right" }
                            ],

                        
                            [
                              { text: "", style: "sectionText", alignment: "right" },
                              { text: `${this.dna.progression_1}`, style: "sectionText", alignment: "right" },
                              { text: "Progression 1 )דרגה(", style: "sectionText", alignment: "right" }
                            ],
                            [
                              { text: "", style: "sectionText", alignment: "right" },
                              { text: `${this.dna.progression_2}`, style: "sectionText", alignment: "right" },
                              { text: "Progression 2 )דרגה(", style: "sectionText", alignment: "right" }
                            ],
                            [
                              { text: "", style: "sectionText", alignment: "right" },
                              { text: `${this.dna.progression_3}`, style: "sectionText", alignment: "right" },
                              { text: "Progression 3 )דרגה(", style: "sectionText", alignment: "right" }
                            ],
                            [
                              { text: "", style: "sectionText", alignment: "right" },
                              { text: `${this.dna.progression_4}`, style: "sectionText", alignment: "right" },
                              { text: "Progression 4 )דרגה(", style: "sectionText", alignment: "right" }
                            ],
                          ]
                        },
                        layout: "lightHorizontalLines" // מסגרת קלה לטבלה
                        
                      }
        ,              
               
                    //    layout: "lightHorizontalLines" // מסגרת קלה לטבלה
                      
                                    ,{
                        text: "  אבחון  ",
                        style: 'sectionHeader'
                      },
                     
                                     ,{
                        text: ` DFI = ${this.dna.dfi}  `,
                        style: 'sactionText',
                        aligment: 'center'
                      },
                                   ,{
                        text: "",
                        style: 'sactionText'
                      },
                                       ,{
                        text: "<= 15% DFI = excellent to good sperm DNA intgrity",
                        style: 'sectionTextSmall'
                      },
                                  ,{
                        text: "> 15% to < 25% DFI = good to fair sperm DNA intgrity",
                        style: 'sectionTextSmall'
                      },
                                    ,{
                        text: "> 25% to < 50% DFI = fair to poor sperm DNA intgrity",
                        style: 'sectionTextSmall'
                      },
                                         ,{
                        text: ">= 50% DFI = very poor sperm DNA intgrity",
                        style: 'sectionTextSmall'
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
                      sectionTextSmall: {  
                      bold: true,  
                      // fontSize: 11, 
                      fontSize: 10.00, 
                      font: 'ARIELF', 
                      margin: [0, 5, 0,5]  ,
                      alignment: 'left'
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
                    let fileName =`${this.persons.manName} ו${this.persons.womanName}  ${this.persons.familyName} ${reversData} DNA.pdf` ;
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
