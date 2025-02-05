import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl ,Validators} from '@angular/forms';
import { PersonsDTO } from '../models/PersonsDTO';
import { PersonsService } from '../services/persons.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params,Router } from '@angular/router';


@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent implements OnInit {

   EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
   @Input() personsIdInput: number;
   @Output() savedSuccessfully = new EventEmitter();
   flagInDialog:boolean=false;
  parmasSubscription:Subscription;
  allPersons:PersonsDTO[];
  displayDeleteDialog:boolean=false;
  personsId:number;
  personToEdit:PersonsDTO;
  toggleLayer:boolean=false;
  textToDialog:string;
  personsToSave:PersonsDTO;
  personsform=new FormGroup({
    manName :  new FormControl("",[Validators.required]),
    womanName : new FormControl("",[Validators.required]),
    familyName : new FormControl("",[Validators.required]),
    manId : new FormControl("",[Validators.required]),
    womanId : new FormControl("",[Validators.required]),
    manDateBirth : new FormControl(""),
    womanDateBirth : new FormControl(""),
    manPhone : new FormControl("",[Validators.required]),
    womanPhone : new FormControl(""),
    manEmail : new FormControl("",[Validators.email]),
    womanEmail : new FormControl("",[Validators.email]),
    city : new FormControl(""),
    addres : new FormControl(""),
    dateMarriage: new FormControl(""),
    numberChildren : new FormControl(""),
    register  : new FormControl(false),
    brothersToTfila:new FormControl(false),
    manFathersName : new FormControl(""),
    womanFathersName : new FormControl("")
  })
  
  addNewItem() {
    this.savedSuccessfully.emit();
  }
  getErrorMessageMan() {
    return this.personsform.controls["ManEmail"].hasError('email') ? 'Not a valid email' : '';
  }
  getErrorMessagewoman() {
    return this.personsform.controls["WomanEmail"].hasError('email') ? 'Not a valid email' : '';
  }
  setPersons(persons:PersonsDTO){
    this.personsform.controls["manName"].setValue(persons.manName);
    this.personsform.controls["womanName"].setValue(persons.womanName);
    this.personsform.controls["familyName"].setValue(persons.familyName);
    this.personsform.controls["manId"].setValue(persons.manId);
    this.personsform.controls["womanId"].setValue(persons.womanId);
    this.personsform.controls["manDateBirth"].setValue(persons.manDateBirth);
    this.personsform.controls["womanDateBirth"].setValue(persons.womanDateBirth);
    this.personsform.controls["manPhone"].setValue(persons.manPhone);
    this.personsform.controls["womanPhone"].setValue(persons.womanPhone);
    this.personsform.controls["manEmail"].setValue(persons.manEmail);
    this.personsform.controls["womanEmail"].setValue(persons.womanEmail);
    this.personsform.controls["city"].setValue(persons.city);
    this.personsform.controls["addres"].setValue(persons.addres);
    this.personsform.controls["dateMarriage"].setValue(persons.dateMarriage);
    this.personsform.controls["numberChildren"].setValue(persons.numberChildren);
    this.personsform.controls["register"].setValue(persons.register);
    this.personsform.controls["brothersToTfila"].setValue(persons.brothersToTfila);
    this.personsform.controls["manFathersName"].setValue(persons.manFathersName);
    this.personsform.controls["womanFathersName"].setValue(persons.womanFathersName);

  }

  savePersons(){
    this.toggleLayer=true;
    let  tmpDate = new Date('0/00/0000 00:00:00');
    this.personsToSave=new PersonsDTO();
    this.personsToSave.manName=  this.personsform.controls["manName"].value;
    this.personsToSave.womanName=  this.personsform.controls["womanName"].value;
    this.personsToSave.familyName   =this.personsform.controls["familyName"].value;
    this.personsToSave.manId = String(this.personsform.controls["manId"].value);
    this.personsToSave.womanId = String(this.personsform.controls["womanId"].value);
    if(this.personsform.controls["manDateBirth"].value=="")
    this.personsToSave.manDateBirth=  tmpDate;
    else
    this.personsToSave.manDateBirth=  this.personsform.controls["manDateBirth"].value;
   if(this.personsform.controls["womanDateBirth"].value=="")
   this.personsToSave.womanDateBirth = tmpDate;
   else
     this.personsToSave.womanDateBirth = this.personsform.controls["womanDateBirth"].value;
   
    this.personsToSave.manPhone = this.personsform.controls["manPhone"].value;
    this.personsToSave.womanPhone = this.personsform.controls["womanPhone"].value;
    this.personsToSave.manEmail =this.personsform.controls["manEmail"].value;
    this.personsToSave.womanEmail  =this.personsform.controls["womanEmail"].value;
    this.personsToSave.city  =this.personsform.controls["city"].value;
    this.personsToSave.addres = this.personsform.controls["addres"].value;
    if(this.personsform.controls["dateMarriage"].value=="")
    this.personsToSave.dateMarriage =tmpDate;
    else
    this.personsToSave.dateMarriage = this.personsform.controls["dateMarriage"].value;

    this.personsToSave.numberChildren = +this.personsform.controls["numberChildren"].value;
    this.personsToSave.register = this.personsform.controls["register"].value;
    this.personsToSave.brothersToTfila = this.personsform.controls["brothersToTfila"].value;
    this.personsToSave.manFathersName =this.personsform.controls["manFathersName"].value;
    this.personsToSave.womanFathersName= this.personsform.controls["womanFathersName"].value;
    if(this.personsId){
      this.personsToSave.personsId=this.personsId;

    }
    else{
      this.personsToSave.personsId=0;
    }
    if(!this.personsId){
    this._PersonsService.getAll().subscribe(
      (data)=>{
        if(data){
        this.allPersons=data;
        let manId=this.allPersons.filter(p=>p.manId==this.personsToSave.manId)
   let womanId=this.allPersons.filter(p=>p.womanId==this.personsToSave.womanId)
   if(manId.length>0 && womanId.length>0 ){
     this.textToDialog="מספרי הזהות של הזוג קיימים במערכת. האם ברצונך ליצור זוג זה"
     this.toggleLayer=false;
     this.displayDeleteDialog=true
   }
  else{
    if(manId.length>0 ){
      this.textToDialog="מספר הזהות של הבעל  קיים במערכת. האם ברצונך ליצור זוג זה"
      this.toggleLayer=false;
      this.displayDeleteDialog=true
    }
    else{
      if(womanId.length>0 ){
        this.textToDialog="מספר הזהות של האשה  קיים במערכת. האם ברצונך ליצור זוג זה"
        this.toggleLayer=false;
        this.displayDeleteDialog=true
        
      }
      else{
        this.finishSavePerson()
      }
    }
  }
      }},
    ( err)=>{
      alert("try ater")
    }
    )
   }else{
     this.finishSavePerson()
   }
    
  }
 finishSavePerson(){
  this.toggleLayer=true;
  this._PersonsService.savePersons(this.personsToSave).subscribe(
    (data)=>{
      if(data){
        if(!this.flagInDialog){
          this.toggleLayer=false;
          this._router.navigate(["main/allPersons"]);
      
        }
        else{
          this.toggleLayer=false;
          this.savedSuccessfully.emit();
        }
       
      }
      else{
        this.toggleLayer=false;
        alert("try later");}
    
      
      },
   (error)=>{
    this.toggleLayer=false;
      alert("try later");}

  )
 }
  constructor(private _PersonsService:PersonsService,private _acr:ActivatedRoute,private _router :Router) { }
  ngOnInit() {
    this._acr.params.subscribe(
      (params: Params) => {
        this.personsId=+params.personsId;
    
      }
    )
    if(this.personsIdInput){
      this.personsId=this.personsIdInput;
      this.flagInDialog=true;
    }
    // this.parmasSubscription = this._acr.paramMap.subscribe(params => {
    //   this.personsId = +(params["params"].personsId)});
      if(this.personsId){
        this._PersonsService.getById(this.personsId).subscribe(
          (data)=>{
            this.personToEdit=data;
            this.setPersons(this.personToEdit);
          },
          (error)=>{
            alert("try later")

          }
        )
        

      }
  }
 

}
