import { Component, OnInit } from '@angular/core';
import { SubsidizationService } from '../services/subsidization.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SubsidizationDTO } from '../models/SubsidizationDTO';

@Component({
  selector: 'app-subsidization',
  templateUrl: './subsidization.component.html',
  styleUrls: ['./subsidization.component.css']
})
export class SubsidizationComponent implements OnInit {

  SubsidizationToSave:SubsidizationDTO;
  Subsidizationform=new FormGroup({
    DatePlease :  new FormControl(""),
    ManWork : new FormControl(""),
    WomanWork : new FormControl(""),
    RabbiName : new FormControl(""),
    RabbiPhone : new FormControl(""),
    RequestReceived : new FormControl(""),
    CheckedBy : new FormControl(""),
    Amount : new FormControl(""),
    CommentsOffice : new FormControl(""),
    CheckNumber : new FormControl("")
  })
  savePersons(){
    this.SubsidizationToSave=this.Subsidizationform.value;
    this._SubsidizationService.saveSubsidization(this.SubsidizationToSave).subscribe(
      (data)=>{
        console.log("data")
        },
     (error)=>{ alert("try later");}

    )

  }
  constructor(private _SubsidizationService:SubsidizationService) { }
  ngOnInit() {
  }

}

