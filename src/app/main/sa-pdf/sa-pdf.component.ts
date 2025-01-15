
import { Component, OnInit, Input } from '@angular/core';
import { SaService } from '../services/sa.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SaDTO } from '../models/SaDTO';
import { ClinicVisitsService } from '../services/clinic-visits.service';
import { PersonsService } from '../services/persons.service';
import { ClinicVisitsDTO } from '../models/ClinicVisitsDTO';
import { PersonsDTO } from '../models/PersonsDTO';
import { EmployeesDTO } from '../models/EmployeesDTO';
import { EmployeesService } from '../services/employees.service';
import  jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-sa-pdf',
  templateUrl: './sa-pdf.component.html',
  styleUrls: ['./sa-pdf.component.css']
})
export class SaPdfComponent implements OnInit {

  @Input() ClinicVisitsId: number;
  saToSave:SaDTO;
  sa:SaDTO;
  saId:number=0;
  clinicVisits:ClinicVisitsDTO;
  persons:PersonsDTO;
  doctor:EmployeesDTO;
  saform=new FormGroup({
    ManName :  new FormControl(""),
    WomanName : new FormControl(""),
    FamilyName : new FormControl(""),
    ManId : new FormControl(""),
    WomanId : new FormControl(""),
    ManPhone : new FormControl(""),
    WomanPhone : new FormControl(""),
    DoctorTreatment :  new FormControl(""),
    Fresh : new FormControl(false),
    Condom : new FormControl(false),
    Ejac : new FormControl(false),
    Cup : new FormControl(false),
    Other : new FormControl(""),
    GivingTime : new FormControl(""),
    VolumeCc : new FormControl(""),
    Appearance : new FormControl(""),
    Conc105cc : new FormControl(""),
    Motility : new FormControl(""),
    Grade : new FormControl(""),
    Ph : new FormControl(""),
    Comments: new FormControl(""),
    NormalForms : new FormControl(""),
    LargeHeads  : new FormControl(""),
    SmallHeads : new FormControl(""),
    RoundHeads : new FormControl(""),
    TaperedHeads : new FormControl(""),
    PyramidalHeads : new FormControl(""),
    AmorphousHeads : new FormControl(""),
    PinHeads : new FormControl(""),
    NeckDefects : new FormControl(""),
    CytoplasmicDroplets : new FormControl(""),
    TailDefects : new FormControl("")
  })
  setPersons(persons:PersonsDTO){
    this.saform.controls["ManName"].setValue(persons.manName);
    this.saform.controls["WomanName"].setValue(persons.womanName);
    this.saform.controls["FamilyName"].setValue(persons.familyName);
    this.saform.controls["ManId"].setValue(persons.manId);
    this.saform.controls["WomanId"].setValue(persons.womanId);
    this.saform.controls["ManPhone"].setValue(persons.manPhone);
    this.saform.controls["WomanPhone"].setValue(persons.womanPhone);
  }
  // setoctor(doctor:EmployeesDTO){
  //   this.saform.controls["DoctorTreatment"].setValue(doctor.employeeName);
  // }
  setSa(sa:SaDTO){
    this.saform.controls["Fresh"].setValue(sa.fresh);
    this.saform.controls["Condom"].setValue(sa.condom);
    this.saform.controls["DoctorTreatment"].setValue(sa.doctorTreatment);
    this.saform.controls["Ejac"].setValue(sa.ejac);
    this.saform.controls["Cup"].setValue(sa.cup);
    this.saform.controls["Other"].setValue(sa.other);
    this.saform.controls["GivingTime"].setValue(sa.givingTime);
    this.saform.controls["VolumeCc"].setValue(sa.volumeCc);
    this.saform.controls["Appearance"].setValue(sa.appearance);
    this.saform.controls["Conc105cc"].setValue(sa.conc105cc);
    this.saform.controls["Motility"].setValue(sa.motility);
    this.saform.controls["Grade"].setValue(sa.grade);
    this.saform.controls["Ph"].setValue(sa.ph);
    this.saform.controls["NormalForms"].setValue(sa.normalForms);
    this.saform.controls["LargeHeads"].setValue(sa.largeHeads);
    this.saform.controls["SmallHeads"].setValue(sa.smallHeads);
    this.saform.controls["RoundHeads"].setValue(sa.roundHeads);
    this.saform.controls["TaperedHeads"].setValue(sa.taperedHeads);
    this.saform.controls["PyramidalHeads"].setValue(sa.pyramidalHeads);
    this.saform.controls["AmorphousHeads"].setValue(sa.amorphousHeads);
    this.saform.controls["PinHeads"].setValue(sa.pinHeads);
    this.saform.controls["NeckDefects"].setValue(sa.neckDefects);
    this.saform.controls["CytoplasmicDroplets"].setValue(sa.cytoplasmicDroplets);
    this.saform.controls["TailDefects"].setValue(sa.tailDefects);
  }
  saveSa(){

    this.saToSave= new SaDTO();
    this.saToSave.said=this.saId;
    this.saToSave.clinicVisitsId=this.ClinicVisitsId;
    this.saToSave.doctorTreatment= this.saform.controls["DoctorTreatment"].value.toString();
    this.saToSave.fresh= this.saform.controls["Fresh"].value;

    this.saToSave.condom= this.saform.controls["Condom"].value;
    this.saToSave.ejac= this.saform.controls["Ejac"].value;
    this.saToSave.cup= this.saform.controls["Cup"].value;
    this.saToSave.other= this.saform.controls["Other"].value.toString();
    this.saToSave.givingTime= new Date();
    this.saToSave.volumeCc= this.saform.controls["VolumeCc"].value.toString();
    this.saToSave.appearance= this.saform.controls["Appearance"].value.toString();
    this.saToSave.conc105cc= this.saform.controls["Conc105cc"].value.toString();
    this.saToSave.motility= this.saform.controls["Motility"].value.toString();
    this.saToSave.grade= this.saform.controls["Grade"].value.toString();
    this.saToSave.ph= this.saform.controls["Ph"].value.toString();
    this.saToSave.normalForms= this.saform.controls["NormalForms"].value.toString();
    this.saToSave.largeHeads= this.saform.controls["LargeHeads"].value.toString();
    this.saToSave.smallHeads=  this.saform.controls["SmallHeads"].value.toString();
    this.saToSave.roundHeads= this.saform.controls["RoundHeads"].value.toString();
    this.saToSave.taperedHeads= this.saform.controls["TaperedHeads"].value.toString();
    this.saToSave.pyramidalHeads= this.saform.controls["PyramidalHeads"].value.toString();
    this.saToSave.amorphousHeads= this.saform.controls["AmorphousHeads"].value.toString();
    this.saToSave.pinHeads= this.saform.controls["PinHeads"].value.toString();
    this.saToSave.neckDefects= this.saform.controls["NeckDefects"].value.toString();
    this.saToSave.cytoplasmicDroplets= this.saform.controls["CytoplasmicDroplets"].value.toString();
    this.saToSave.tailDefects= this.saform.controls["TailDefects"].value.toString();

    this._SaService.saveSa(this.saToSave).subscribe(
      (data)=>{
        console.log("data")
        },
     (error)=>{ alert("try later");}

    )
  }
  title = 'html-to-pdf';
  generatePDF() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4');
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('newPDF.pdf');
    });
  }
  constructor(private _SaService:SaService,private _clinicVisitsService:ClinicVisitsService
    ,private _personsService:PersonsService,private _EmployeesDTO:EmployeesService) { }
  ngOnInit() {
    this._SaService.getByClinicVisitId(this.ClinicVisitsId).subscribe(
      (data)=>{
        if(data){
        this.sa=data;
        this.saId=this.sa.said;
        this.setSa(this.sa)}},
      (err)=>{}
    )
    this._clinicVisitsService.getById(this.ClinicVisitsId).subscribe(
      (data)=>{
        this.clinicVisits=data;
        this._personsService.getById(this.clinicVisits.personsId).subscribe(
          (data)=>{this.persons=data;
            this.setPersons(this.persons)},
          (error)=>{alert("try later")}
          
        )
        // this._EmployeesDTO.getById(this.clinicVisits.doctor).subscribe(
        //   (data)=>{
        //     this.doctor=data;
        //     this.setoctor(this.doctor);
        //   },
        //   (error)=>{alert("try later")}
        // )
      },
     (error)=>{ alert("try later")})



  }


}
