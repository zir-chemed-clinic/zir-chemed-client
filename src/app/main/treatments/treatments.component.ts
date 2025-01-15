import { Component, OnInit } from '@angular/core';
import { TreatmentService } from '../services/treatment.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TreatmentsDTO } from '../models/TreatmentsDTO';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.component.html',
  styleUrls: ['./treatments.component.css']
})
export class TreatmentsComponent implements OnInit {
  toggleLayer:boolean=false;
  TreatmentsToSave:TreatmentsDTO;
  treatmentsId:number=0;
  treatmentsToEdit:TreatmentsDTO;
  flagNew:boolean=true;
  flagEdit:boolean=false;

  Treatmentform=new FormGroup({
    TreatmentName :  new FormControl(""),
    TreatmentCost : new FormControl("")
  })
  saveTreatments(){
    this.toggleLayer=true;
    this.TreatmentsToSave=new TreatmentsDTO();
    this.TreatmentsToSave.treatmentId=this.treatmentsId;
    this.TreatmentsToSave.treatmentName=this.Treatmentform.controls["TreatmentName"].value;
    this.TreatmentsToSave.treatmentCost=+ this.Treatmentform.controls["TreatmentCost"].value;
    this._TreatmentService.saveTreatments(this.TreatmentsToSave).subscribe(
      (data)=>{
        this._router.navigate(["main/allTreatments"]);
        this.toggleLayer=false;
      
        },
     (error)=>{ 
      this.toggleLayer=false;
       alert("try later");}

    )
  }
  setTreatments(treatments:TreatmentsDTO){
    this.Treatmentform.controls["TreatmentName"].setValue(treatments["treatmentName"]);
    this.Treatmentform.controls["TreatmentCost"].setValue(treatments["treatmentCost"]);

  }
  constructor(private _TreatmentService:TreatmentService,private _acr:ActivatedRoute,private _router :Router) { }
  ngOnInit() {
    this._acr.params.subscribe(
      (params: Params) => {
        this.treatmentsId=+params.TreatmentId;
      }
    )
    if(this.treatmentsId){
     

      this._TreatmentService.getById(this.treatmentsId).subscribe(
        (data)=>{
          this.treatmentsToEdit=data;
          this.setTreatments(this.treatmentsToEdit);
          this.flagNew=false;
          this.flagEdit=true;
        },
        (error)=>{
          alert("try later")

        }
      )
    }
    else{
      this.treatmentsId=0;
    }
  }

}
