import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClinicVisitsDTO } from '../models/ClinicVisitsDTO';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClinicVisitsService {
  getByemployeesIdAndDate(employeesId: number, fromDate, untilDate):Observable<ClinicVisitsDTO[]> {
    return this._http.get<ClinicVisitsDTO[]>('/api​/ClinicVisits​/getByDates/'+employeesId+','+fromDate+','+untilDate);
  }
  getClinicVisits(employeesId: number, fromDate, untilDate):Observable<ClinicVisitsDTO[]>{
    return this._http.get<ClinicVisitsDTO[]>('/api/ClinicVisits/getByDates/'+employeesId+','+fromDate+','+untilDate);
  }
  getById(ClinicVisitsId: number):Observable<ClinicVisitsDTO> {
    return this._http.get<ClinicVisitsDTO>('/api/ClinicVisits/getById/'+ClinicVisitsId);
  }
  saveClinicVisit(clinicVisitToSave: ClinicVisitsDTO):Observable<ClinicVisitsDTO> {
    return this._http.post<ClinicVisitsDTO>('/api/ClinicVisits',clinicVisitToSave)
  }
  getAll():Observable<ClinicVisitsDTO[]> {
    return this._http.get<ClinicVisitsDTO[]>('/api/ClinicVisits');
  }
  getByFlag(flag:boolean):Observable<ClinicVisitsDTO[]> {
    return this._http.get<ClinicVisitsDTO[]>('/api/ClinicVisits/getByFlag/'+flag+','+1);
    // return this._http.get<ClinicVisitsDTO[]>('/api/ClinicVisits');
  }
  deleteById(id:number):Observable<ClinicVisitsDTO> {
    return this._http.put<ClinicVisitsDTO>('api/ClinicVisits/',id);
  }
  constructor(private _http:HttpClient) { }
}
