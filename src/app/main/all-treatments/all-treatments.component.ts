import { Component, OnInit } from '@angular/core';
import { TreatmentService } from '../services/treatment.service';
import { TreatmentsDTO } from '../models/TreatmentsDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-treatments',
  templateUrl: './all-treatments.component.html',
  styleUrls: ['./all-treatments.component.css']
})
export class AllTreatmentsComponent implements OnInit {

  allTreatment:TreatmentsDTO[];
  newTreatment(){
    this._router.navigate(["main/Treatments"]);
    }
    edit(treatments:TreatmentsDTO){
      let id=treatments["treatmentId"];
      this._router.navigate(["main/Treatments/"+id]);
    }
  constructor(private _treatmentService:TreatmentService,private _router: Router) { }
  
  ngOnInit() {
    this._treatmentService.getAll().subscribe(
      (data)=>{
        this.allTreatment=data;
        },
     (error)=>{ alert("try later");})
  }

}
