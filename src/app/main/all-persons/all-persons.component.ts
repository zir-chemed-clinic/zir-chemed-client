import { Component, OnInit } from '@angular/core';
import { PersonsService } from '../services/persons.service';
import { PersonsDTO } from '../models/PersonsDTO';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';
import { PermissionService } from 'src/app/permission.service';
// import {MdInputDirective} from '@angular/material';
@Component({
  selector: 'app-all-persons',
  templateUrl: './all-persons.component.html',
  styleUrls: ['./all-persons.component.css']
})
export class AllPersonsComponent implements OnInit {
  director:boolean;
 allPersons:PersonsDTO[]=[];
 allPersonsToDisplay:PersonsDTO[]=[];
  personsform=new FormGroup({
  familyName : new FormControl(""),
  manName : new FormControl(""),
  womanName : new FormControl(""),
  manId : new FormControl(""),
  womanId : new FormControl(""),
  manPhone : new FormControl(""),
  womanPhone:new FormControl("")  
})

 newPerson(){
  this._router.navigate(["main/persons"]);
  }
  edit(persons:PersonsDTO){
    let id=persons["personsId"];
    this._router.navigate(["main/persons/"+id]);
  }
  searchByfamilyName(){
    let string=this.personsform.controls["familyName"].value;
    this.allPersonsToDisplay=this.allPersons.filter(p=>p.familyName.includes(string))
  
  }
  searchBymanName(){
    let string=this.personsform.controls["manName"].value;
    this.allPersonsToDisplay=this.allPersons.filter(p=>p.manName.includes(string))
  
  }
  searchBywomanName(){
    let string=this.personsform.controls["womanName"].value;
    this.allPersonsToDisplay=this.allPersons.filter(p=>p.womanName.includes(string))
  
  }
  searchBymanId(){
    let string=this.personsform.controls["manId"].value;
    this.allPersonsToDisplay=this.allPersons.filter(p=>p.manId.toString().includes(string))
  
  }
  searchBywomanId(){
    let string=this.personsform.controls["womanId"].value;
    this.allPersonsToDisplay=this.allPersons.filter(p=>p.womanId.toString().includes(string))
  }
  searchBywomanPhone(){
    debugger
    let womanPhone = this.personsform.controls["womanPhone"].value;
    this.allPersonsToDisplay=this.allPersons.filter(p=>p.womanPhone.toString().includes(womanPhone))
  }

  searchByAll(){
    let familyName=this.personsform.controls["familyName"].value;
    let manName=this.personsform.controls["manName"].value;
    let womanName=this.personsform.controls["womanName"].value;
    let manId=this.personsform.controls["manId"].value;
    let womanId=this.personsform.controls["womanId"].value;
    let womanPhone =this.personsform.controls["womanPhone"].value; 
    let manPhone = this.personsform.controls["manPhone"].value;
    this.allPersonsToDisplay=this.allPersons.filter(p=>p.familyName.includes(familyName) && 
    p.manName.includes(manName) && p.womanName.includes(womanName) && p.manId.toString().includes(manId)
    && p.womanId.toString().includes(womanId) && p.womanPhone.toString().includes(womanPhone)
    && p.manPhone.toString().includes(manPhone))
  }
  createExelFile(){
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet("Employee Data");
    let header=["שם משפחה","שם הבעל","שם האשה","ת.ז. הבעל","ת.ז. האשה","ת.ל. הבעל"
    ,"ת.ל. האשה","מספר טל הבעל","מספר טל האשה","דואל הבעל","דואל האשה","עיר מגורים"
    ,"כתובת","תאריך חתונה","מספר ילדים","רישום למאגר חברתי","רישום למאגר אחים לתפילה"]
   
  let headerRow = worksheet.addRow(header);
  headerRow.font = { bold: true };
  for (let person of this.allPersons)
{
  // let x2=Object.keys(x1);
  let row=[person.familyName,person.manName,person.womanName,person.manId,person.womanId,person.manDateBirth
  ,person.womanDateBirth,person.manPhone,person.womanPhone,person.manEmail,person.womanEmail,person.city
  ,person.addres,person.dateMarriage,person.numberChildren,person.register?"√":"X",person.brothersToTfila?"√":"X"]
  // for(let y of x2)
  // {
  //   temp.push(x1[y])
  // }
  worksheet.addRow(row)
}
let fname="מאגר זוגות ציר חמד"
let dtae = new Date();
let dd = String(dtae.getDate()).padStart(2, '0');
let mm = String(dtae.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = dtae.getFullYear();

let today = dd + '.' + mm + '.' + yyyy;
// add data and file name and download
workbook.xlsx.writeBuffer().then((data) => {
  let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  fs.saveAs(blob, fname+'-'+today+'.xlsx');
});
  }
  constructor(private _personsService:PersonsService,private _router: Router,private _acr:ActivatedRoute
    ,private _PermissionService:PermissionService) { }
  ngOnInit() {
     this.director=this._PermissionService.director;
     this._personsService.getAll().subscribe(
      (data)=>{
        this.allPersons=data.reverse();
        this.allPersonsToDisplay=this.allPersons;
        },
     (error)=>{ alert("try later");}

    )
  }

}
