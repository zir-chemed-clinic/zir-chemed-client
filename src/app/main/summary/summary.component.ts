import { Component, OnInit } from '@angular/core';
import { ClinicVisitsService } from '../services/clinic-visits.service';
import { ClinicVisitsDTO } from '../models/ClinicVisitsDTO';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  clinicVisitsList:ClinicVisitsDTO[]=[];
  arr=[];
  indexYear=[];
  createList() {
    this.arr[0]=[[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]]
    ,[[],[],[],[],[],[],[],[]]
    ,[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[]]
    ,[[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[]]]
    let indexTreatmentName;
    switch(this.clinicVisitsList[0].treatments.treatmentName) { 
      case "SA": { 
        indexTreatmentName=0
         break; 
      } 
      case "לא ניתן לבצע בדיקת זרע": { 
        indexTreatmentName=1
         break; 
      } 
      case "IUI": { 
        indexTreatmentName=2
         break; 
      } 
      case "לא ניתן לבצע השבחה": { 
        indexTreatmentName=3
         break; 
      } 
      case "Wash": { 
        indexTreatmentName=4
         break; 
      } 
      case "PCT": { 
        indexTreatmentName=5
        break; 
     } 
     case "Insemination": { 
      indexTreatmentName=6
      break; 
   } 
   case "IUI + SA": { 
    indexTreatmentName=7
    break; 
 } }
 this.arr[0][new Date(this.clinicVisitsList[0].visitsDate).getMonth()-1][indexTreatmentName].push(this.clinicVisitsList[0])
    let index=0;
    this.indexYear=[]
    this.indexYear[0]=new Date(this.clinicVisitsList[0].visitsDate).getFullYear()
    for(let i=1;i<this.clinicVisitsList.length;i++){
      console.log(i)
      let indexTreatmentName;
      switch(this.clinicVisitsList[i].treatments.treatmentName) { 
        case "SA": { 
          indexTreatmentName=0
           break; 
        } 
        case "לא ניתן לבצע בדיקת זרע": { 
          indexTreatmentName=1
           break; 
        } 
        case "IUI": { 
          indexTreatmentName=2
           break; 
        } 
        case "לא ניתן לבצע השבחה": { 
          indexTreatmentName=3
           break; 
        } 
        case "Wash": { 
          indexTreatmentName=4
           break; 
        } 
        case "PCT": { 
          indexTreatmentName=5
          break; 
       } 
       case "Insemination": { 
        indexTreatmentName=6
        break; 
     } 
     case "IUI + SA": { 
      indexTreatmentName=7
      break; 
   } 
   case "ייעוץ": { 
    indexTreatmentName=8
    break; 
 }
     } 
      if( this.indexYear[index]!=new Date(this.clinicVisitsList[i].visitsDate).getFullYear()){
        index=index+1
        this.indexYear[index]=new Date(this.clinicVisitsList[i].visitsDate).getFullYear()
        this.arr[index]=[[[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[]],
        [[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[]]
        ,[[],[],[],[],[],[],[],[],[]]
        ,[[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[]],
        [[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[]]
        ,[[],[],[],[],[],[],[],[],[]],
        [[],[],[],[],[],[],[],[],[]]]
        this.arr[index][new Date(this.clinicVisitsList[i].visitsDate).getMonth()][indexTreatmentName].push(this.clinicVisitsList[i]);
      }
      else{
        this.arr[index][new Date(this.clinicVisitsList[i].visitsDate).getMonth()][indexTreatmentName].push(this.clinicVisitsList[i])
      }
    }
  }
  constructor(private _cinicVisitsService:ClinicVisitsService) { }

  ngOnInit() {
    debugger
    this._cinicVisitsService.getByFlag(true).subscribe(
      (data)=>{
        debugger
        // data.sort(function(a,b){
        //   // Turn your strings into dates, and then subtract them
        //   // to get a value that is either negative, positive, or zero.
        //   return new Date(b.visitsDate) - new Date(a.visitsDate);
        // });
        this.clinicVisitsList=data.reverse();
      this.clinicVisitsList.sort(function (a, b) {
        return new Date(a.visitsDate).getFullYear() - new Date(b.visitsDate).getFullYear();
    });

    this.createList1()
    
    }
       ,
     (error)=>{ alert("try later");})
  }
  createList1() {
    this.arr[0]=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]
    ,[0,0,0,0,0,0,0,0]
    ,[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]
    ,[0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]]
    let indexTreatmentName;
    switch(this.clinicVisitsList[0].treatments.treatmentName) { 
      case "SA": { 
        indexTreatmentName=0
         break; 
      } 
      case "לא ניתן לבצע בדיקת זרע": { 
        indexTreatmentName=1
         break; 
      } 
      case "IUI": { 
        indexTreatmentName=2
         break; 
      } 
      case "לא ניתן לבצע השבחה": { 
        indexTreatmentName=3
         break; 
      } 
      case "Wash": { 
        indexTreatmentName=4
         break; 
      } 
      case "PCT": { 
        indexTreatmentName=5
        break; 
     } 
     case "Insemination": { 
      indexTreatmentName=6
      break; 
   } 
   case "IUI + SA": { 
    indexTreatmentName=7
    break; 
 } 
 case "ייעוץ": { 
  indexTreatmentName=8
  break; 
}}
 this.arr[0][new Date(this.clinicVisitsList[0].visitsDate).getMonth()][indexTreatmentName]= this.arr[0][new Date(this.clinicVisitsList[0].visitsDate).getMonth()][indexTreatmentName]+1;
    let index=0;
    this.indexYear[0]=new Date(this.clinicVisitsList[0].visitsDate).getFullYear()
    for(let i=1;i<this.clinicVisitsList.length;i++){
      console.log(i)
      let indexTreatmentName;
      switch(this.clinicVisitsList[i].treatments.treatmentName) { 
        case "SA": { 
          indexTreatmentName=0
           break; 
        } 
        case "לא ניתן לבצע בדיקת זרע": { 
          indexTreatmentName=1
           break; 
        } 
        case "IUI": { 
          indexTreatmentName=2
           break; 
        } 
        case "לא ניתן לבצע השבחה": { 
          indexTreatmentName=3
           break; 
        } 
        case "Wash": { 
          indexTreatmentName=4
           break; 
        } 
        case "PCT": { 
          indexTreatmentName=5
          break; 
       } 
       case "Insemination": { 
        indexTreatmentName=6
        break; 
     } 
     case "IUI + SA": { 
      indexTreatmentName=7
      break; 
   } 
   case "ייעוץ": { 
    indexTreatmentName=8
    break; 
 }
     } 
      if( this.indexYear[index]!=new Date(this.clinicVisitsList[i].visitsDate).getFullYear()){
        index=index+1
        this.indexYear[index]=new Date(this.clinicVisitsList[i].visitsDate).getFullYear()
        this.arr[index]=[[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]
        ,[0,0,0,0,0,0,0,0,0]
        ,[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]
        ,[0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]]
        this.arr[index][new Date(this.clinicVisitsList[i].visitsDate).getMonth()][indexTreatmentName]=this.arr[index][new Date(this.clinicVisitsList[i].visitsDate).getMonth()][indexTreatmentName]+1;
      }
      else{
        this.arr[index][new Date(this.clinicVisitsList[i].visitsDate).getMonth()][indexTreatmentName]=this.arr[index][new Date(this.clinicVisitsList[i].visitsDate).getMonth()][indexTreatmentName]+1;
      }
    }
  }

}
