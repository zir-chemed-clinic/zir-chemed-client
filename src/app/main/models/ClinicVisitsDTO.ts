import { EmployeesDTO } from './EmployeesDTO';
import { PersonsDTO } from './PersonsDTO';
import { TreatmentsDTO } from './TreatmentsDTO';

export class ClinicVisitsDTO{
    clinicVisitsId :number;
    treatmentsId : number;
    personsId :number;
    preformed :number
    doctor :number;
    morphology:number
    paymentMethod :string;
    receipt :number;
    c :boolean;
    co :boolean;
    done:boolean;
    doneDoctor:boolean;
    doneMorphology:boolean;
    didNotArrive:boolean;
    amount: number;
    subsidization :Boolean;
    closed:Boolean;
    closedSA:Boolean;
    closedIUI:Boolean;
    visitsDate:Date;
    apartmentHr:Boolean;
    apartmentVy:Boolean;
    doctorNavigation:EmployeesDTO;
    persons:PersonsDTO;
    preformedNavigation:EmployeesDTO;
    morphologyNavigation:EmployeesDTO;
      treatments:TreatmentsDTO;
      visitTime:String;
      subsidizationApprove:Boolean;
     subsidizationAmount:string;
     checkNumber:string;
}



