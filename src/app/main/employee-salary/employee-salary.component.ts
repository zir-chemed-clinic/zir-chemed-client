import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../services/employees.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EmployeesDTO } from '../models/EmployeesDTO';
import { ClinicVisitsService } from '../services/clinic-visits.service';
import { ClinicVisitsDTO } from '../models/ClinicVisitsDTO';
import { FormGroup, FormControl } from '@angular/forms';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { strGnuMICR } from '../../fonts/GnuMICRttfBase64Encoded'
import { strAriel } from '../../fonts/ariel'
import { Observable } from 'rxjs';
import { strLogo } from '../stringLogo'
class Column {
  text: string; font?: string; color?: string; bold?: boolean; fontSize?: number; style?: {}; direction?: string
}
@Component({
  selector: 'app-employee-salary',
  templateUrl: './employee-salary.component.html',
  styleUrls: ['./employee-salary.component.css']
})
export class EmployeeSalaryComponent implements OnInit {

  employeesId: number;
  displayResponsive:boolean=false;
  clinicVisitIdToDisplay:number;
  employeeName: string = "";
  employee: EmployeesDTO;
  flagSalary: boolean = false;
  employeeClinicVisits: ClinicVisitsDTO[] = [];
  SA: number;
  SAMorphology: number;
  IUISAMorphology: number;
  IUI: number;
  PCT: number;
  Insemination: number;
  IUISA: number;
  Consulting: number;
  Wash: number;
  CanNotBeMadeIUI: number;
  CanNotBeMadeSA: number;
  flag: Boolean = false;
  flagPDF: boolean = false;
  IUISAMorphologyList: ClinicVisitsDTO[];
  SAList: ClinicVisitsDTO[];
  IUIList: ClinicVisitsDTO[];
  PCTList: ClinicVisitsDTO[];
  SAMorphologyList: ClinicVisitsDTO[];
  InseminationList: ClinicVisitsDTO[];
  IUISAList: ClinicVisitsDTO[];
  ConsultingList: ClinicVisitsDTO[];
  WashList: ClinicVisitsDTO[];
  CanNotBeMadeIUIList: ClinicVisitsDTO[];
  CanNotBeMadeSAList: ClinicVisitsDTO[];

  employeeSalaryform = new FormGroup({
    fromDate: new FormControl(""),
    untilDate: new FormControl("")
  })
  clear() {
    this.employeeClinicVisits = [];
    this.flag = false;
    this.flagPDF = false;
    this.flagSalary = false;
  }
  getEmployeeClinicVisits() {
    let date1 = this.employeeSalaryform.controls["fromDate"].value;
    let year1 = date1.getFullYear()
    let month1 = date1.getMonth() + 1
    let day1 = date1.getDate()
    let fromDate = `${year1}-${month1}-${day1}`;

    let date2 = this.employeeSalaryform.controls["untilDate"].value;
    let year2 = date2.getFullYear()
    let month2 = date2.getMonth() + 1
    let day2 = date2.getDate()
    let untilDate = `${year2}-${month2}-${day2}`;
    this._ClinicVisitsService.getClinicVisits(this.employeesId, fromDate, untilDate).subscribe(
      (data) => {
        this.employeeClinicVisits = data;
        this.flagSalary = true;
        // let tmp= this.employeeClinicVisits.filter(e=>)

        // this.date1=
        // this._ClinicVisitsService.getByemployeesIdAndDate(this.employeesId,)

      },
      (error) => {
        alert("try later")

      }
    )
  }
  toClinicVisits(clinicVisits) {
    this.displayResponsive=false;
    let id = clinicVisits["clinicVisitsId"];
    // // this._router.navigate(["main/clinicVisits/"+id]);
    // this._router.navigate([]).then(result => { window.open("main/clinicVisits/" + id, '_blank'); });
    this.clinicVisitIdToDisplay=+id;
    this.displayResponsive=true;
  }
  salary() {
    // גם וגם שווה 3 איש מעבדה שווה 2 רופא שווה 1
    if (this.employee.role == 2) {
      this.SAList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "SA" && c.done == true && c.preformed==this.employee.employeeId);
      this.SAMorphologyList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "SA" && c.doneMorphology == true && c.morphology==this.employee.employeeId);
      this.IUISAMorphologyList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "IUI + SA" && c.doneMorphology == true && c.morphology==this.employee.employeeId);
      this.IUIList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "IUI" && c.done == true && c.preformed==this.employee.employeeId);
      this.PCTList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "PCT" && c.done == true && c.preformed==this.employee.employeeId);
      this.InseminationList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "Insemination" && c.done == true && c.preformed==this.employee.employeeId);
      this.IUISAList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "IUI + SA" && c.done == true && c.preformed==this.employee.employeeId);
      this.ConsultingList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "ייעוץ" && c.done == true && c.preformed==this.employee.employeeId);
      this.WashList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "Wash" && c.done == true && c.preformed==this.employee.employeeId);
      this.CanNotBeMadeIUIList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "לא ניתן לבצע השבחה" && c.done == true && c.preformed==this.employee.employeeId);
      this.CanNotBeMadeSAList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "לא ניתן לבצע בדיקת זרע" && c.done == true && c.preformed==this.employee.employeeId);
    }
    if (this.employee.role == 1) {
      this.SAList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "SA" && c.doneDoctor == true && c.doctor==this.employee.employeeId);
      this.SAMorphologyList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "SA" && c.doneMorphology == true && c.morphology==this.employee.employeeId);
      this.IUISAMorphologyList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "IUI + SA" && c.doneMorphology == true && c.morphology==this.employee.employeeId);
      this.IUIList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "IUI" && c.doneDoctor == true && c.doctor==this.employee.employeeId);
      this.PCTList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "PCT" && c.doneDoctor == true && c.doctor==this.employee.employeeId);
      this.InseminationList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "Insemination" && c.doneDoctor == true && c.doctor==this.employee.employeeId);
      this.IUISAList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "IUI + SA" && c.doneDoctor == true && c.doctor==this.employee.employeeId);
      this.ConsultingList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "ייעוץ" && c.doneDoctor == true && c.doctor==this.employee.employeeId);
      this.WashList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "Wash" && c.doneDoctor == true && c.doctor==this.employee.employeeId);
      this.CanNotBeMadeIUIList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "לא ניתן לבצע השבחה" && c.doneDoctor == true && c.doctor==this.employee.employeeId);
      this.CanNotBeMadeSAList = this.employeeClinicVisits.filter(c => c.treatments.treatmentName == "לא ניתן לבצע בדיקת זרע" && c.doneDoctor == true && c.doctor==this.employee.employeeId);
    }
    this.SA = this.SAList.length;
    this.IUI = this.IUIList.length;
    this.PCT = this.PCTList.length;
    this.Insemination = this.InseminationList.length;
    this.IUISA = this.IUISAList.length;
    this.Consulting = this.ConsultingList.length;
    this.Wash = this.WashList.length;
    this.CanNotBeMadeIUI = this.CanNotBeMadeIUIList.length;
    this.CanNotBeMadeSA = this.CanNotBeMadeSAList.length;
    this.SAMorphology = this.SAMorphologyList.length;
    this.IUISAMorphology = this.IUISAMorphologyList.length;
    this.flag = true;
    this.flagPDF = true;
  }
  constructor(private _EmployeesService: EmployeesService, private _ClinicVisitsService: ClinicVisitsService
    , private _acr: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this._acr.params.subscribe(
      (params: Params) => {
        this.employeesId = params.employeesId;
      }
    )
    // this.parmasSubscription = this._acr.paramMap.subscribe(params => {
    //   this.personsId = +(params["params"].personsId)});
    if (this.employeesId) {
      this._EmployeesService.getById(this.employeesId).subscribe(
        (data) => {
          this.employee = data;
          this.employeeName = this.employee.employeeName;
          // this.date1=
          // this._ClinicVisitsService.getByemployeesIdAndDate(this.employeesId,)

        },
        (error) => {
          alert("try later")

        }
      )

    }
  }
  revers(data) {
    return data.split(' ').reverse().join(' ');

  }
  generatePDF(action = 'open') {
    let date1 = this.employeeSalaryform.controls["fromDate"].value;
    let year1 = date1.getFullYear()
    let month1 = date1.getMonth() + 1
    let day1 = date1.getDate()
    let fromDate = `${year1}-${month1}-${day1}`;
    let arr = fromDate.split('-');
    fromDate = `${arr[2]}/${arr[1]}/${arr[0]}`;

    let date2 = this.employeeSalaryform.controls["untilDate"].value;
    let year2 = date2.getFullYear()
    let month2 = date2.getMonth() + 1
    let day2 = date2.getDate()
    let untilDate = `${year2}-${month2}-${day2}`;
    let arr1 = untilDate.split('-');
    untilDate = `${arr1[2]}/${arr1[1]}/${arr1[0]}`;
    let datesClinicVisits = [];

    datesClinicVisits.push({
      columns: [
        [
          {
            text: "Zir Chemed",
            font: 'ARIELF',
            color: '#03746e',
            bold: true,
            fontSize: 10

          },
          {
            text: "Dr. Baruch Brooks, PhD",
            font: 'ARIELF',
            color: '#03746e',
            fontSize: 10
          },
          {
            text: "Scientific Director and Fertility Expert",
            font: 'ARIELF',
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
            font: 'ARIELF',
            color: '#03746e',
            fontSize: 10
          }
        ],
        [
          {
            // image: 'data:image/jpeg;base64,...encodedContent...',

            image: `data:image/JPG;base64,${strLogo}`
            , width: 130,
            height: 100,
            alignment: 'center',
          }
        ],


        [
          {
            text: this.revers(" ציר חמד "),
            font: 'ARIELF',
            alignment: 'right',
            color: '#03746e',
            bold: true,
            fontSize: 10
          },
          {
            text: this.revers("  דר ברוך ברוקס PhD"),
            font: 'ARIELF',
            alignment: 'right',
            color: '#03746e',
            fontSize: 10
          },
          {
            text: this.revers(" מנהל מדעי ומומחה לפוריות "),
            font: 'ARIELF',
            alignment: 'right',
            color: '#03746e',
            fontSize: 10
          },
          {
            text: this.revers("טל: 02-6535395"),
            font: 'ARIELF',
            alignment: 'right',
            color: '#03746e',
            fontSize: 10
          },
          {
            text: "drbrooks@zirchemed.org דואל ",
            font: 'ARIELF',
            alignment: 'right',
            color: '#03746e',
            fontSize: 10
          }

        ]
      ]

    })
    datesClinicVisits.push({
      text: 'Zir Chemed Laboratory -  שכר נתוני ',
      style: 'sectionHeaderH'
    })
    datesClinicVisits.push({
      text: `${this.revers(this.employee.employeeName)} `,
      style: 'sectionHeaderH'

    })
    datesClinicVisits.push({
      text: `${untilDate} תאריך עד  ${fromDate} מתאריך`,
      style: 'sectionText',
      direction: 'rtl'
    })
    if (this.SA > 0) {
      datesClinicVisits.push({
        text: 'SA',
        style: 'sectionHeader',
        direction: 'rtl'
      })
      for (let i = 0; i < this.SA; i++) {
        let date;
        if (this.SAList[i].visitsDate) {
          let arr3 = this.SAList[i].visitsDate.toString().split('T')[0].split('-');
          date = `${arr3[2]}/${arr3[1]}/${arr3[0]}`;
        }
        else date = "";
        datesClinicVisits.push({
          text: `${date}`,
          style: 'sectionText',
          direction: 'rtl'
        })
      }
      datesClinicVisits.push({
        text: ` ${this.SA} * ${this.employee.paymentForSA} = ${this.SA * this.employee.paymentForSA}`,
        style: 'sectionText',
        direction: 'rtl'
      })
      datesClinicVisits.push({
        text: ` ${this.SA} * 15 = ${this.SA * 15}`,
        style: 'sectionText',
        direction: 'rtl'
      });
    }

    if (this.SAMorphology > 0) {
      datesClinicVisits.push({
        text: ' בבדיקה מורפולוגיה ',
        style: 'sectionHeader',
        direction: 'rtl'
      })
      for (let i = 0; i < this.SAMorphology; i++) {
        let date;
        if (this.SAMorphologyList[i].visitsDate) {
          let arr = this.SAMorphologyList[i].visitsDate.toString().split('T')[0].split('-');
          date = `${arr[2]}/${arr[1]}/${arr[0]}`;
        }
        else date = "";
        datesClinicVisits.push({
          text: `${date}`,
          style: 'sectionText',
          direction: 'rtl'
        })
      }
      datesClinicVisits.push({
        text: ` ${this.SAMorphology} * ${this.employee.paymentForMorphology} = ${this.SAMorphology * this.employee.paymentForMorphology}`,
        style: 'sectionText',
        direction: 'rtl'
      })
      datesClinicVisits.push({
        text: ` ${this.SAMorphology} * 20 = ${this.SAMorphology * 20}`,
        style: 'sectionText',
        direction: 'rtl'
      });
    }

    if (this.IUI > 0) {
      datesClinicVisits.push({
        text: 'IUI',
        style: 'sectionHeader',
        direction: 'rtl'
      })
      for (let i = 0; i < this.IUI; i++) {
        let date;
        if (this.IUIList[i].visitsDate) {
          let arr = this.IUIList[i].visitsDate.toString().split('T')[0].split('-');
          date = `${arr[2]}/${arr[1]}/${arr[0]}`;
        }
        else date = "";
        datesClinicVisits.push({
          text: `${date}`,
          style: 'sectionText',
          direction: 'rtl'
        })
      }
      datesClinicVisits.push({
        text: `${this.IUI} * ${this.employee.paymentForIUI} = ${this.IUI * this.employee.paymentForIUI}`,
        style: 'sectionText',
        direction: 'rtl'
      })
      datesClinicVisits.push({
        text: `${this.IUI} * 45 = ${this.IUI * 45}`,
        style: 'sectionText',
        direction: 'rtl'
      });
    }
    if (this.PCT > 0) {
      datesClinicVisits.push({
        text: 'PCT',
        style: 'sectionHeader',
        direction: 'rtl'
      })
      for (let i = 0; i < this.PCT; i++) {
        let date;
        if (this.PCTList[i].visitsDate) {
          let arr = this.PCTList[i].visitsDate.toString().split('T')[0].split('-');
          date = `${arr[2]}/${arr[1]}/${arr[0]}`;
        }
        else date = "";
        datesClinicVisits.push({
          text: `${date}`,
          style: 'sectionText',
          direction: 'rtl'
        })
      }
      datesClinicVisits.push({
        text: `${this.PCT} * ${this.employee.paymentForPCT} = ${this.PCT * this.employee.paymentForPCT}`,
        style: 'sectionText',
        direction: 'rtl'
      })
      datesClinicVisits.push({
        text: `${this.PCT} * 15 = ${this.PCT * 15}`,
        style: 'sectionText',
        direction: 'rtl'
      })
      ;

    }
    if (this.Insemination > 0) {
      datesClinicVisits.push({
        text: 'Insemination',
        style: 'sectionHeader',
        direction: 'rtl'
      })
      for (let i = 0; i < this.Insemination; i++) {
        let date;
        if (this.InseminationList[i].visitsDate) {
          let arr = this.InseminationList[i].visitsDate.toString().split('T')[0].split('-');
          date = `${arr[2]}/${arr[1]}/${arr[0]}`;
        }
        else date = "";
        datesClinicVisits.push({
          text: `${date}`,
          style: 'sectionText',
          direction: 'rtl'
        })
      }
      datesClinicVisits.push({
        text: `${this.Insemination} * ${this.employee.paymentForInsemination} = ${this.Insemination * this.employee.paymentForInsemination}`,
        style: 'sectionText',
        direction: 'rtl'
      })
      datesClinicVisits.push({
        text: `${this.Insemination} * 10 = ${this.Insemination * 10}`,
        style: 'sectionText',
        direction: 'rtl'
      });
    }
    if (this.IUISA > 0) {
      datesClinicVisits.push({
        text: 'IUI + SA',
        style: 'sectionHeader',
        direction: 'rtl'
      })
      for (let i = 0; i < this.IUISA; i++) {
        let date;
        if (this.IUISAList[i].visitsDate) {
          let arr = this.IUISAList[i].visitsDate.toString().split('T')[0].split('-');
          date = `${arr[2]}/${arr[1]}/${arr[0]}`;
        }
        else date = "";
        datesClinicVisits.push({
          text: `${date}`,
          style: 'sectionText',
          direction: 'rtl'
        })
      }
    }
    datesClinicVisits.push({
      text: ` ${this.IUISA} * ${this.employee.paymentForIUISA} = ${this.IUISA * this.employee.paymentForIUISA}`,
      style: 'sectionText',
      direction: 'rtl'
    })
    datesClinicVisits.push({
      text: ` ${this.IUISA} * 45 = ${this.IUISA * 45}`,
      style: 'sectionText',
      direction: 'rtl'
    });
    if (this.IUISAMorphology > 0) {
      datesClinicVisits.push({
        text: ' והשבחה בבדיקה מורפולוגיה ',
        style: 'sectionHeader',
        direction: 'rtl'
      })
      for (let i = 0; i < this.IUISAMorphology; i++) {
        let date;
        if (this.IUISAMorphologyList[i].visitsDate) {
          let arr = this.IUISAMorphologyList[i].visitsDate.toString().split('T')[0].split('-');
          date = `${arr[2]}/${arr[1]}/${arr[0]}`;
        }
        else date = "";
        datesClinicVisits.push({
          text: `${date}`,
          style: 'sectionText',
          direction: 'rtl'
        })
      }
      datesClinicVisits.push({
        text: ` ${this.IUISAMorphology} * ${this.employee.paymentForMorphology} = ${this.IUISAMorphology * this.employee.paymentForMorphology}`,
        style: 'sectionText',
        direction: 'rtl'
      })
      datesClinicVisits.push({
        text: ` ${this.IUISAMorphology} * 20 = ${this.IUISAMorphology * 20}`,
        style: 'sectionText',
        direction: 'rtl'
      });
    }
    if (this.Consulting > 0) {
      datesClinicVisits.push({
        text: 'ייעוץ',
        style: 'sectionHeader',
        direction: 'rtl'
      })
      for (let i = 0; i < this.Consulting; i++) {
        let date;
        if (this.ConsultingList[i].visitsDate) {
          let arr = this.ConsultingList[i].visitsDate.toString().split('T')[0].split('-');
          date = `${arr[2]}/${arr[1]}/${arr[0]}`;
        }
        else date = "";
        datesClinicVisits.push({
          text: `${date}`,
          style: 'sectionText',
          direction: 'rtl'
        })
      }
      datesClinicVisits.push({
        text: `${this.Consulting} * ${this.employee.paymentForConsulting} = ${this.Consulting * this.employee.paymentForConsulting}`,
        style: 'sectionText',
        direction: 'rtl'
      })
      datesClinicVisits.push({
        text: `${this.Consulting} * 60 = ${this.Consulting * 60}`,
        style: 'sectionText',
        direction: 'rtl'
      });
    }
    if (this.Wash > 0) {
      datesClinicVisits.push({
        text: 'Wash',
        style: 'sectionHeader',
        direction: 'rtl'
      })
      for (let i = 0; i < this.Wash; i++) {
        let date;
        if (this.WashList[i].visitsDate) {
          let arr = this.WashList[i].visitsDate.toString().split('T')[0].split('-');
          date = `${arr[2]}/${arr[1]}/${arr[0]}`;
        }
        else date = "";
        datesClinicVisits.push({
          text: `${date}`,
          style: 'sectionText',
          direction: 'rtl'
        })
      }
      datesClinicVisits.push({
        text: ` ${this.Wash} * ${this.employee.paymentForWash} = ${this.Wash * this.employee.paymentForWash}`,
        style: 'sectionText',
        direction: 'rtl'
      })
      datesClinicVisits.push({
        text: ` ${this.Wash} * 45 = ${this.Wash * 45}`,
        style: 'sectionText',
        direction: 'rtl'
      });
    }
    if (this.CanNotBeMadeIUI > 0) {
      datesClinicVisits.push({
        text: this.revers(' טיפולים בהם לא היה ניתן לבצע השבחה '),
        style: 'sectionHeader',
        direction: 'rtl'
      })
      for (let i = 0; i < this.CanNotBeMadeIUI; i++) {
        let date;
        if (this.CanNotBeMadeIUIList[i].visitsDate) {
          let arr = this.CanNotBeMadeIUIList[i].visitsDate.toString().split('T')[0].split('-');
          date = `${arr[2]}/${arr[1]}/${arr[0]}`;
        }
        else date = "";
        datesClinicVisits.push({
          text: `${date}`,
          style: 'sectionText',
          direction: 'rtl'
        })
      }
      datesClinicVisits.push({
        text: `${this.CanNotBeMadeIUI} * ${this.employee.paymentForcanNotBeMadeIUI} = ${this.CanNotBeMadeIUI * this.employee.paymentForcanNotBeMadeIUI}`,
        style: 'sectionText',
        direction: 'rtl'
      })
      datesClinicVisits.push({
        text: `${this.CanNotBeMadeIUI} * 15 = ${this.CanNotBeMadeIUI * 15}`,
        style: 'sectionText',
        direction: 'rtl'
      });
    }
    if (this.CanNotBeMadeSA > 0) {
      datesClinicVisits.push({
        text: this.revers(' טיפולים בהם לא היה ניתן לבצע בדיקת זרע '),
        style: 'sectionHeader',
        direction: 'rtl'
      })
      for (let i = 0; i < this.CanNotBeMadeSA; i++) {
        let date;
        if (this.CanNotBeMadeSAList[i].visitsDate) {
          let arr = this.CanNotBeMadeSAList[i].visitsDate.toString().split('T')[0].split('-');
          date = `${arr[2]}/${arr[1]}/${arr[0]}`;
        }
        else date = "";
        datesClinicVisits.push({
          text: `${date}`,
          style: 'sectionText',
          direction: 'rtl'
        })
      }
      datesClinicVisits.push({
        text: `${this.CanNotBeMadeSA} * ${this.employee.paymentForCanNotBeMadeSA} = ${this.CanNotBeMadeSA * this.employee.paymentForCanNotBeMadeSA}`,
        style: 'sectionText',
        direction: 'rtl'
      })
      datesClinicVisits.push({
        text: `${this.CanNotBeMadeSA} * 15 = ${this.CanNotBeMadeSA * 15}`,
        style: 'sectionText',
        direction: 'rtl'
      });
    }

    datesClinicVisits.push({
      text: `  סה"כ   ${this.SA * this.employee.paymentForSA + this.IUI * this.employee.paymentForIUI + this.PCT * this.employee.paymentForPCT
        + this.Insemination * this.employee.paymentForInsemination + this.IUISA * this.employee.paymentForIUISA +
        this.Consulting * this.employee.paymentForConsulting + this.Wash * this.employee.paymentForWash +
        this.CanNotBeMadeIUI * this.employee.paymentForcanNotBeMadeIUI + this.CanNotBeMadeSA * this.employee.paymentForCanNotBeMadeSA +
        this.SAMorphology * this.employee.paymentForMorphology + this.IUISAMorphology * this.employee.paymentForMorphology}`,
      style: 'sectionHeader',
      direction: 'rtl'
    })
    datesClinicVisits.push({
      text: ` שעות   ${(this.SA * 15 + this.IUI * 45 + this.PCT * 15
        + this.Insemination * 10 + this.IUISA * 45 +
        this.Consulting * 60 + this.Wash * 45 +
        this.CanNotBeMadeIUI * 15 + this.CanNotBeMadeSA * 15 +
        this.SAMorphology * 20 + this.IUISAMorphology * 20)/60} סה"כ`,
      style: 'sectionHeader',
      direction: 'rtl'
    })
    pdfFonts.pdfMake.vfs['GnuMICR_b64'] = strGnuMICR;
    pdfFonts.pdfMake.vfs['ARIEL_b64'] = strAriel;
    pdfMake.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      },
      GnuMICR: {
        normal: 'GnuMICR_b64',
        bold: 'GnuMICR_b64',
        italics: 'GnuMICR_b64',
        bolditalics: 'GnuMICR_b64'
      },
      ARIELF: {
        normal: 'ARIEL_b64',
        bold: 'ARIEL_b64',
        italics: 'ARIEL_b64',
        bolditalics: 'ARIEL_b64'
      }
    }
    let docDefinition = {
      content: datesClinicVisits,
      styles: {
        sectionzirChemed: {
          font: 'ARIELF',
          color: '#03746e',
          margin: [0, 3.5, 0, 3],
          alignment: 'center',
          fontSize: 10
        },
        sectionHeader: {
          bold: true,
          alignment: 'right',
          fontSize: 13,
          font: 'ARIELF',
          margin: [0, 6, 0, 6],
          fillColor: '#00BFFF'
        },
        sectionHeaderH: {
          bold: true,
          alignment: 'center',
          fontSize: 16,
          font: 'ARIELF',
          margin: [0, 6, 0, 6],
          fillColor: '#00BFFF'
        },
        sectionText: {
          bold: true,
          fontSize: 11,
          font: 'ARIELF',
          margin: [0, 5, 0, 5],
          alignment: 'right'
        },

        sectionTextCenter: {
          bold: true,
          fontSize: 11,
          font: 'ARIELF',
          margin: [0, 3, 0, 3],
          alignment: 'center'
        }
      }
    }
    // let tmp=datesClinicVisits;
    // docDefinition.content.push(datesClinicVisits)
    let fileName =`${this.employee.employeeName}.pdf`;
    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download(fileName);
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }


}
